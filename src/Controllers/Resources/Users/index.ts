import { Express, Request, Response } from 'express'

import Bcrypt from 'src/Helpers/Bcrypt';
import Joi from 'joi'
import Prisma from '@Clients/Prisma';
import { Prisma as PrismaType } from '@prisma/client';
import ResponseHandler from 'src/Helpers/ResponseHandler';
import Schema from 'src/Helpers/SchemaHelper';

class Users {
  constructor(private readonly app: Express) {
    this.get()
    this.signUp()
  }

  async get() {
    this.app.get('/api/users/:id', async (req: Request, res: Response) => {
      const { id } = req.params

      try {
        if (!id) new ResponseHandler(res, 401, { error: 'Invalid or missing ID' })
        else {
          const user = await Prisma.user.findFirst({
            where: { id },
            select: {
              id: true,
              email: true,
              name: true,
              createdAt: true,
            }
          })

          if (!user) return new ResponseHandler(res, 404, { error: 'User not found' })
          if (user) return new ResponseHandler(res, 200, user)
        }
      } catch (error) {
        new ResponseHandler(res, 500)
      }
    })
  }


  async signUp() {
    this.app.post('/api/users', async (req: Request, res: Response) => {

      const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        phone: Joi.string().required().min(8).max(14),
        password: Joi.string().min(8)
      })

      const errors = Schema.validateSchema(schema, req.body)

      if (errors) {
        return new ResponseHandler(res, 400, { error: errors })
      }

      try {
        const { email, name, password, phone }: PrismaType.UserCreateInput = req.body

        await Prisma.user.create({
          data: {
            email,
            name,
            password: await Bcrypt.hashPassword(password),
            phone
          }
        })

        return new ResponseHandler(res, 201, { message: 'User created' })
      } catch (error) {
        if ((error as any).code === 'P2002') return new ResponseHandler(res, 400, { error: 'User already exists' })
        else return new ResponseHandler(res, 500, { error: 'Internal server error' })
      }
    })
  }
}

export default Users