import Authentication from '@Controllers/Authentication'
import Devotionals from '@Controllers/Resources/Devotionals'
import { Express } from 'express'
import GrowthGroups from '@Controllers/Resources/GrowthGroups'
import Middlewares from '@Controllers/Middlewares'
import Stats from '@Controllers/Resources/Stats'
import Users from '@Controllers/Resources/Users'

export default class RoutesController {
  constructor(private readonly app: Express) {
    new Middlewares(this.app)
    new Authentication(this.app)

    new GrowthGroups(this.app)
    new Users(this.app)

    new Devotionals(this.app)
    new Stats(this.app)
  }
}
