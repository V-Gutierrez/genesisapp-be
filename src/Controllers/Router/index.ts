import Devotionals from '@Controllers/Resources/Devotionals'
import { Express } from 'express'
import GrowthGroups from '@Controllers/Resources/GrowthGroups'
import Middlewares from '@Controllers/Middlewares'
import Users from '@Controllers/Resources/Users'
import Authentication from '@Controllers/Authentication'

export default class RoutesController {
  constructor(private readonly app: Express) {

    new Middlewares(this.app)
    new Authentication(this.app)
    new Users(this.app)
    new GrowthGroups(this.app)
    new Devotionals(this.app)
  }
}
