import 'dotenv/config'

import express, { Express, NextFunction, Request, Response } from 'express'

import CookieHelper from '@Helpers/Cookies'
import { Decoded } from '@Types/DTO'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import isProduction from '@Helpers/Environment'
import jwt from 'jsonwebtoken'
import morgan from 'morgan'
import multer from 'multer'

export default class Middlewares {
  constructor(private readonly app: Express) {
    this.CORS()

    this.app.use(express.json())
    this.app.use(cookieParser())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
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

  static JWT(app: Express) {
    app.use(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { [CookieHelper.AuthCookieDefaultOptions.name]: token } = req.cookies
        console.log('🚀 ~ file: index.ts ~ line 41 ~ Middlewares ~ app.use ~ token', token)
        console.log(
          '🚀 ~ file: index.ts ~ line 41 ~ Middlewares ~ app.use ~ req.cookies',
          req.cookies,
        )

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err: any) => {
          if (err) return res.sendStatus(403)
          next()
        })
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static IsAdmin(app: Express) {
    app.use(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { [CookieHelper.AuthCookieDefaultOptions.name]: token } = req.cookies

        jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET as string,
          (err: any, decoded: Decoded) => {
            if (err) return res.sendStatus(403)
            if (decoded.role !== 'ADMIN') return res.sendStatus(401)
            next()
          },
        )
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static SingleFileUpload(formDataKey: string) {
    return multer().single(formDataKey)
  }
}
