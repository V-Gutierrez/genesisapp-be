import { Express, NextFunction, Request, Response } from 'express'

import cors from 'cors'

export default class Middlewares {
  constructor(private readonly app: Express) {
    this.CORS()
    this.Logger()
  }

  CORS() {
    this.app.use(cors({ origin: ['http://localhost:3000', 'http://192.168.0.56:3000/', 'https://genesisproject-six.vercel.app'] }))
  }

  Logger() {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(
        `${req.method} ${req.url} --- Origin: ${req.headers.origin} with Status Code: ${res.statusCode} - ${res.statusMessage
        } - ${Date.now()}`,
      )
      next()
    })
  }

}
