import { Express } from 'express'
import cors from 'cors'

export default class Middlewares {
  constructor(private readonly app: Express) {
    this.CORS()
    this.Logger()
  }

  CORS() {
    this.app.use(cors({ origin: ['http://localhost:3000', 'http://192.168.0.56:3000/'] }))
  }

  Logger() {
    this.app.use((req, res, next) => {
      console.log(
        `${req.method} ${req.url} --- Origin: ${req.headers.origin} with Status Code: ${res.statusCode} - ${
          res.statusMessage
        } - ${Date.now()}`,
      )
      next()
    })
  }
}
