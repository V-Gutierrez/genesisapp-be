import express, { Express } from 'express'

import Devotionals from '@Controllers/Resources/Devotionals'
import GrowthGroups from '@Controllers/Resources/GrowthGroups'
import Middlewares from '@Controllers/Middlewares'
import Users from '@Controllers/Resources/Users'

export default class RoutesController {
  constructor(private readonly app: Express) {
    app.use(express.json())

    new Middlewares(this.app)
    new Users(this.app)
    new GrowthGroups(this.app)
    new Devotionals(this.app)
  }
}
