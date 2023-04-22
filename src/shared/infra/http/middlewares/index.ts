import 'dotenv/config'
import rateLimit from 'express-rate-limit'

import express, { Express, NextFunction, Request, Response } from 'express'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import morgan from 'morgan'
import multer from 'multer'
import CookieHelper from 'src/shared/helpers/Cookies'
import isProduction from 'src/shared/helpers/Environment'
import { Errors } from 'src/shared/helpers/Messages'
import { Decoded } from '@Shared/types/dtos'

export default class Middlewares {
  constructor(private readonly app: Express) {
    this.CORS()
    this.rateLimiter()

    this.app.use(express.json())
    this.app.use(cookieParser())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(morgan('short'))

    this.UserContext(this.app)
  }

  private CORS() {
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

  private UserContext(app: Express) {
    app.use(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { [CookieHelper.AuthCookieDefaultOptions.name]: token } =
          req.cookies

        jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET as string,
          (err: any, decoded: Decoded) => {
            if (err) req.cookies.user = null
            else req.cookies.user = decoded

            next()
          },
        )
      } catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
    })
  }

  private rateLimiter() {
    const limiter = rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 200, // Limit each IP to 200 requests per `window` (here, per 10 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    })

    this.app.use(limiter)
  }

  static Authentication(req: Request, res: Response, next: NextFunction) {
    try {
      const { [CookieHelper.AuthCookieDefaultOptions.name]: token } =
        req.cookies

      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
        (err: any) => {
          if (err) return res.status(403).json({ message: Errors.NO_AUTH })
          next()
        },
      )
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }

  static AdminPermissioner(req: Request, res: Response, next: NextFunction) {
    try {
      const { [CookieHelper.AuthCookieDefaultOptions.name]: token } =
        req.cookies

      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
        (err: any, decoded: Decoded) => {
          if (err) return res.status(403).json({ message: Errors.NO_AUTH })
          if (decoded.role !== 'ADMIN')
            return res.status(401).json({ message: Errors.NO_AUTH })
          next()
        },
      )
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }

  static SingleFileUpload(formDataKey: string) {
    const EIGHT_HUNDRED_KB_IN_BYTES = 800 * 1024

    return multer({
      limits: { fileSize: EIGHT_HUNDRED_KB_IN_BYTES },
    }).single(formDataKey)
  }
}
