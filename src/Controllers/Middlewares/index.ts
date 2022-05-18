import 'dotenv/config'

import express, { Express, NextFunction, Request, Response } from 'express'

import Joi from 'joi'
import Prisma from '@Clients/Prisma'
import SchemaHelper from '@Helpers/SchemaHelper'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import jwt from 'jsonwebtoken'

export default class Middlewares {
  constructor(private readonly app: Express) {
    this.CORS()
    this.Logger()

    this.app.use(express.json())
    this.app.use(cookieParser())
    this.app.use(express.urlencoded({ extended: false }))
  }

  CORS() {
    this.app.use(
      cors({
        origin: [
          'http://localhost:3000',
          'http://192.168.0.56:3000/',
          'https://genesisproject-six.vercel.app',
        ],
      }),
    )
  }

  Logger() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`${req.method} ${req.url} --- Origin: ${req.headers.origin}`)
      next()
    })
  }

  static JWT(app: Express) {
    app.use(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const schema = Joi.object().keys({
          jwt: Joi.required(),
        })

        const errors = SchemaHelper.validateSchema(schema, req.cookies)
        if (errors) return res.sendStatus(401)

        const { jwt: token } = req.cookies

        const user = await Prisma.user.findFirst({
          where: {
            UserRefreshTokens: { some: { token } },
          },
        })

        if (!user) return res.sendStatus(403)

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, decoded: any) => {
          if (err || user.email !== decoded.email || user.role !== decoded.role)
            return res.sendStatus(403)
          next()
        })
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}
