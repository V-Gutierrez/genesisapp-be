import { ApplicationRouter } from 'src/shared/infra/http/router'
import express from 'express'
import type { Express } from 'express'

class Server {
  constructor(private app: Express) {
    this.app.listen(process.env.PORT || 5000, () => {
      new ApplicationRouter(app)
      console.log(
        '[Server] Server initialized on port:',
        process.env.PORT || 5000,
      )
    })
  }
}

new Server(express())
