import 'dotenv/config'

import { Errors, Success } from '@Helpers/Messages'
import { Express, Request, Response } from 'express'

import Bcrypt from '@Helpers/Bcrypt'
import Joi from 'joi'
import Middlewares from '@Controllers/Middlewares'
import Prisma from '@Clients/Prisma'
import SchemaHelper from '@Helpers/SchemaHelper'
import SendgridClient from '@Services/Sendgrid'
import { User } from '@prisma/client'
import isProduction from '@Helpers/Environment'
import jwt from 'jsonwebtoken'

class Users {
  constructor(private readonly app: Express) {
    this.signUp()

    Middlewares.JWT(this.app)
    this.get()
  }

  async get() {
    this.app.get('/api/users/:id', async (req: Request, res: Response) => {
      const { id } = req.params

      try {
        if (!id) res.status(401).json({ error: Errors.INVALID_OR_MISSING_ID })
        else {
          const user = await Prisma.user.findFirst({
            where: { id },
            select: {
              id: true,
              email: true,
              name: true,
              createdAt: true,
              birthdate: true,
            },
          })

          if (!user) res.status(404).json({ error: Errors.USER_NOT_FOUND })
          if (user) res.status(200).json(user)
        }
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  async signUp() {
    this.app.post('/api/users', async (req: Request, res: Response) => {
      const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        phone: Joi.string()
          .regex(/^\+[0-9]{2}\s[0-9]{1,2}\s[0-9]{1,2}\s[0-9]{4}\-[0-9]{4}/)
          .required(),
        password: Joi.string()
          .min(8)
          .regex(/[a-z]/)
          .regex(/[A-Z]/)
          .regex(/[0-9]/)
          .regex(/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/)
          .required(),
        birthdate: Joi.string().required(),
      })

      const errors = SchemaHelper.validateSchema(schema, req.body)

      try {
        if (errors) {
          res.status(400).json({ error: errors })
        } else {
          const { email, name, password, phone, birthdate }: User = req.body

          const user = await Prisma.user.create({
            data: {
              email,
              name,
              birthdate: new Date(birthdate).toISOString(),
              password: await Bcrypt.hashPassword(password),
              phone,
            },
            select: {
              id: true,
              email: true,
              name: true,
              createdAt: true,
              phone: true,
              password: false,
            },
          })

          const token = jwt.sign({ id: user.id }, process.env.ACTIVATION_TOKEN_SECRET as string, {
            expiresIn: '30d',
          })

          if (isProduction) {
            const emailSender = new SendgridClient()

            await emailSender.send(
              emailSender.TEMPLATES.confirmationEmail.config(user.email, {
                userFirstName: user.name.split(' ')[0],
                activationUrl: `${process.env.FRONT_BASE_URL}/activate?token=${token}`,
              }),
            )
          } else {
            console.log('Activation token for ', email, ' : ', token)
          }

          res.status(201).json({ message: Success.USER_CREATED, user })
        }
      } catch (error) {
        if ((error as any).code === 'P2002')
          res.status(409).json({ error: Errors.USER_ALREADY_EXISTS })
        else res.status(500).json({ error: Errors.INTERNAL_SERVER_ERROR })
      }
    })
  }
}

export default Users
