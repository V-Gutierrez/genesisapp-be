/* eslint-disable no-console */
import { ApplicationRouter } from 'src/shared/infra/http/router'
import express from 'express'
import type { Express } from 'express'

class Server {
  constructor(private app: Express) {
    this.app.listen(process.env.PORT || 8080, () => {
      this.initializeRouter(app)
      this.setProxyTrust(app)

      console.info(
        '[Server] Server initialized on port:',
        process.env.PORT || 8080,
      )
    })
  }

  private initializeRouter(app: Express) {
    new ApplicationRouter(app)
  }

  private setProxyTrust(app: Express) {
    // This is suggested by GCP
    app.set('trust proxy', true)
  }
}

new Server(express())
