import { ApplicationRouter } from 'src/shared/infra/http/router'
import express from 'express'
import type { Express } from 'express'

class Server {
  constructor(private app: Express) {
    this.setProxyTrust()
    this.initializeRouter()

    this.app.listen(process.env.PORT || 5000, () => {
      console.log(
        '[Server] Server initialized on port:',
        process.env.PORT || 5000,
      )
    })
  }

  private initializeRouter() {
    new ApplicationRouter(this.app)
  }

  private setProxyTrust() {
    this.app.set('trust proxy', true)
  }
}

new Server(express())
