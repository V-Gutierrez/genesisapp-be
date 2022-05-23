import 'dotenv/config'

import express, { Express, NextFunction, Request, Response } from 'express'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import isProduction from '@Helpers/Environment'
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
    const localEnvironments = isProduction
      ? []
      : ['http://localhost:3000', 'http://192.168.0.56:3000']

    this.app.use(
      cors({
        credentials: true,
        origin: [process.env.FRONT_BASE_URL as string, ...localEnvironments],
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
        const { jwt: token } = req.cookies

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any, decoded: any) => {
          if (err) return res.sendStatus(403)
          next()
        })
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}
