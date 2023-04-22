/* eslint-disable no-console */
import { ApplicationRouter } from 'src/shared/infra/http/router'
import express from 'express'
import type { Express } from 'express'

class Server {
  constructor(private app: Express) {
    this.setProxyTrust()
    this.initializeRouter()

    this.app.listen(process.env.PORT || 8080, () => {
      console.info(
        '[Server] Server initialized on port:',
        process.env.PORT || 8080,
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
