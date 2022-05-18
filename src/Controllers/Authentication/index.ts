import 'dotenv/config'

import { Express, Request, Response } from 'express'

import Bcrypt from '@Helpers/Bcrypt'
import Joi from 'joi'
import Prisma from '@Clients/Prisma'
import SchemaHelper from '@Helpers/SchemaHelper'
import { User } from '@prisma/client'
import isProduction from '@Helpers/Environment'
import jwt from 'jsonwebtoken'

class Authentication {
  constructor(private readonly app: Express) {
    this.authenticate()
    this.refreshToken()
    this.logout()
  }

  async authenticate() {
    this.app.post('/api/auth', async (req: Request, res: Response) => {
      try {
        const schema = Joi.object().keys({
          email: Joi.string().email().required(),
          password: Joi.string().required(),
        })

        const errors = SchemaHelper.validateSchema(schema, req.body)

        if (errors) return res.status(400).json({ error: errors })

        const { email, password }: Partial<User> = req.body

        const user = await Prisma.user.findFirst({
          where: {
            email,
          },
          select: {
            password: true,
            email: true,
            id: true,
            role: true,
          },
        })

        if (!user) return res.sendStatus(401)

        const matchPassword = await Bcrypt.comparePassword(password as string, user.password)

        if (matchPassword) {
          const accessToken = jwt.sign(
            { email: user.email, role: user.role },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: '12h' },
          )
          console.log(
            '🚀 ~ file: index.ts ~ line 54 ~ Authentication ~ this.app.post ~ process.env.ACCESS_TOKEN_SECRET',
            process.env.ACCESS_TOKEN_SECRET,
          )
          const refreshToken = jwt.sign(
            { email: user.email, role: user.role },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '30d' },
          )
          console.log(
            '🚀 ~ file: index.ts ~ line 60 ~ Authentication ~ this.app.post ~ process.env.REFRESH_TOKEN_SECRET',
            process.env.REFRESH_TOKEN_SECRET,
          )

          await Prisma.userRefreshTokens.upsert({
            where: {
              userId: user.id,
            },
            update: {
              token: refreshToken,
            },
            create: {
              userId: user.id,
              token: refreshToken,
            },
          })

          res.cookie('jwt', refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30 * 1000,
            secure: isProduction,
          })
          res.status(200).json({ userLoggedIn: true, accessToken })
        } else {
          return res.sendStatus(401)
        }
      } catch (error) {
        console.log('🚀 ~ file: index.ts ~ line 78 ~ Authentication ~ this.app.post ~ error', error)
        res.sendStatus(500)
      }
    })
  }

  async refreshToken() {
    this.app.get('/api/auth', async (req: Request, res: Response) => {
      try {
        const schema = Joi.object().keys({
          jwt: Joi.required(),
        })

        const errors = SchemaHelper.validateSchema(schema, req.cookies)
        if (errors) return res.sendStatus(401)

        const { jwt: refreshToken } = req.cookies

        const user = await Prisma.user.findFirst({
          where: {
            UserRefreshTokens: { some: { token: refreshToken } },
          },
        })

        if (!user) return res.sendStatus(403)

        jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET as string,
          (err: any, decoded: any) => {
            if (err || user.email !== decoded.email) return res.sendStatus(403)

            const accessToken = jwt.sign(
              { email: user.email },
              process.env.ACCESS_TOKEN_SECRET as string,
              { expiresIn: '12h' },
            )

            res.json({ accessToken })
          },
        )
      } catch (error) {
        console.log('🚀 ~ file: index.ts ~ line 112 ~ Authentication ~ this.app.get ~ error', error)
        res.sendStatus(500)
      }
    })
  }

  async logout() {
    this.app.delete('/api/auth', async (req: Request, res: Response) => {
      try {
        const schema = Joi.object().keys({
          jwt: Joi.required(),
        })

        const errors = SchemaHelper.validateSchema(schema, req.cookies)
        if (errors) return res.sendStatus(204)

        const { jwt: refreshToken } = req.cookies

        const user = await Prisma.user.findFirst({
          where: {
            UserRefreshTokens: { some: { token: refreshToken } },
          },
        })

        if (!user) {
          res.clearCookie('jwt', { httpOnly: true, secure: isProduction })
          return res.sendStatus(204)
        }
        await Prisma.userRefreshTokens.delete({
          where: { userId: user.id },
        })

        res.clearCookie('jwt', { httpOnly: true, secure: isProduction })
        return res.sendStatus(204)
      } catch (error) {
        console.log(
          '🚀 ~ file: index.ts ~ line 150 ~ Authentication ~ this.app.delete ~ error',
          error,
        )
        res.sendStatus(500)
      }
    })
  }
}

export default Authentication
