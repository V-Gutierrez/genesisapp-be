import { Express, Request, Response } from 'express'

import Bcrypt from 'src/Helpers/Bcrypt'
import Joi from 'joi'
import Prisma from '@Clients/Prisma';
import SchemaHelper from 'src/Helpers/SchemaHelper'
import { User } from '@prisma/client'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

class Authentication {
  constructor(private readonly app: Express) {
    dotenv.config()
    this.authenticate()
  }

  async authenticate() {
    this.app.post('/api/authenticate', async (req: Request, res: Response) => {
      const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.required(),
      })

      const errors = SchemaHelper.validateSchema(schema, req.body)

      if (errors) {
        return res.status(400).json({ error: errors })
      }

      try {
        const { email, password }: Partial<User> = req.body

        const user = await Prisma.user.findFirst({ where: { email: email }, select: { password: true, email: true } })

        if (!user) return res.sendStatus(401)

        const matchPassword = await Bcrypt.comparePassword(user.password, password as string)

        if (matchPassword) {
          const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '12h' })
          const refreshToken = jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '30d' })

          await Prisma.user.update({ where: { email: user.email }, data: { refreshToken: refreshToken } })


          res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 60 * 60 * 24 * 30 * 1000 })
          res.status(200).json({ userLoggedIn: true, accessToken })
        } else {
          return res.sendStatus(401)
        }

      } catch (error) {
        return res.sendStatus(500)
      }
    })
  }

}

export default Authentication