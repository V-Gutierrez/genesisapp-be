import { Express, Request, Response } from 'express'

import Bcrypt from 'src/Helpers/Bcrypt';
import Joi from 'joi'
import Prisma from '@Clients/Prisma';
import SchemaHelper from 'src/Helpers/SchemaHelper';
import { User } from '@prisma/client';

class Users {
  constructor(private readonly app: Express) {
    this.get()
    this.signUp()
  }

  async get() {
    this.app.get('/api/users/:id', async (req: Request, res: Response) => {
      const { id } = req.params

      try {
        if (!id) return res.status(401).json({ error: 'Invalid or missing ID' })
        else {
          const user = await Prisma.user.findFirst({
            where: { id },
            select: {
              id: true,
              email: true,
              name: true,
              createdAt: true,
              birthdate: true
            }
          })

          if (!user) return res.status(404).json({ error: 'User not found' })
          if (user) return res.status(200).json(user)
        }
      } catch (error) {
        return res.sendStatus(500)
      }
    })
  }


  async signUp() {
    this.app.post('/api/users', async (req: Request, res: Response) => {

      const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        phone: Joi.string().required().min(8).max(14),
        password: Joi.string().min(8),
        birthdate: Joi.date().required()
      })

      const errors = SchemaHelper.validateSchema(schema, req.body)

      if (errors) {
        return res.status(400).json({ error: errors })
      }

      try {
        const { email, name, password, phone, birthdate }: User = req.body

        await Prisma.user.create({
          data: {
            email,
            name,
            birthdate,
            password: await Bcrypt.hashPassword(password),
            phone
          }
        })

        return res.status(201).json({ message: 'User created' })
      } catch (error) {
        if ((error as any).code === 'P2002') return res.status(409).json({ error: 'User already exists' })
        else return res.status(500).json({ error: 'Internal server error' })
      }
    })
  }
}

export default Users