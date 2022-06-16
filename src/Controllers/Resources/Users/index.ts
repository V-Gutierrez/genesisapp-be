import 'dotenv/config'

import { Errors, Success } from '@Helpers/Messages'
import { Express, Request, Response } from 'express'

import Bcrypt from '@Helpers/Bcrypt'
import Formatter from '@Helpers/Formatter'
import SchemaHelper from '@Helpers/SchemaHelper'
import SendgridClient from '@Services/Sendgrid'
import { User } from '@prisma/client'
import { UserModel } from '@Models/Users'
import jwt from 'jsonwebtoken'

class Users {
  static async get(app: Express) {
    app.get('/api/users/:id', async (req: Request, res: Response) => {
      const { id } = req.params

      try {
        if (!id) res.status(401).json({ error: Errors.INVALID_OR_MISSING_ID })
        else {
          const user = await UserModel.getUserById(id)

          if (!user) res.status(404).json({ error: Errors.USER_NOT_FOUND })
          if (user) res.status(200).json(user)
        }
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static async signUp(app: Express) {
    app.post('/api/users', async (req: Request, res: Response) => {
      try {
        const errors = SchemaHelper.validateSchema(SchemaHelper.SIGNUP_SCHEMA, req.body)

        if (errors) return res.status(400).json({ error: errors })

        const { email, name, password, phone, birthdate }: User = req.body

        const user = await UserModel.create({
          email: Formatter.sanitizeEmail(email),
          name,
          birthdate: new Date(birthdate).toISOString(),
          password: await Bcrypt.hashPassword(password),
          phone,
        })

        const token = jwt.sign({ id: user.id }, process.env.ACTIVATION_TOKEN_SECRET as string, {
          expiresIn: '30d',
        })

        const emailSender = new SendgridClient()

        await emailSender.send(
          emailSender.TEMPLATES.confirmationEmail.config(user.email, {
            userFirstName: Formatter.getUserFirstName(user.name),
            activationUrl: `${process.env.FRONT_BASE_URL}/activate?token=${token}`,
          }),
        )

        res.status(201).json({ message: Success.USER_CREATED, user })
      } catch (error) {
        if ((error as any).code === 'P2002')
          res.status(409).json({ error: Errors.USER_ALREADY_EXISTS })
        else res.status(500).json({ error: Errors.INTERNAL_SERVER_ERROR })
      }
    })
  }

  static async getAllUsersAsAdmin(app: Express) {
    app.get('/api/users', async (_: Request, res: Response) => {
      try {
        const users = await UserModel.getAll()

        res.status(200).json(users)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}

export default Users
