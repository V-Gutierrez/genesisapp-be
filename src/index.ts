import RoutesController from '@Controllers/RoutesController'
import express from 'express'

class Server {
  constructor(private app = express()) {
    this.app.listen(process.env.PORT || 5000, () => new RoutesController(app))
  }
}

new Server()