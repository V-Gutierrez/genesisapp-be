import express, { Express, NextFunction, Request, Response } from 'express'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

export default class Middlewares {
  constructor(private readonly app: Express) {
    dotenv.config()

    this.CORS()
    this.Logger()

    this.app.use(express.json())
    this.app.use(cookieParser())
    this.app.use(express.urlencoded({ extended: false }))
  }

  CORS() {
    this.app.use(cors({ origin: ['http://localhost:3000', 'http://192.168.0.56:3000/', 'https://genesisproject-six.vercel.app'] }))
  }

  Logger() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(
        `${req.method} ${req.url} --- Origin: ${req.headers.origin} - ${JSON.stringify(req.headers)}`,
      )
      next()
    })
  }

  static JWT(app: Express) {
    app.use((req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization

      if (!authHeader) return res.sendStatus(401)
      const token = authHeader

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
        if (err) return res.sendStatus(403)

        next()
      })
    })
  }
}
