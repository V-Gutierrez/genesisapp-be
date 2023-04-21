import { ApplicationRouter } from '@Shared/infra/http/router'
import express from 'express'

class Server {
  constructor(private app = express()) {
    this.app.listen(process.env.PORT || 5000, () => new ApplicationRouter(app))
  }
}

new Server()
