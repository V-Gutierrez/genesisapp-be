import Devotionals from '@Controllers/Resources/Devotionals'
import { Express } from 'express'
import GrowthGroups from '@Controllers/Resources/GrowthGroups'
import Middlewares from '@Controllers/Middlewares'

export default class RoutesController {
  constructor(private readonly app: Express) {
    new Middlewares(this.app)
    new GrowthGroups(this.app)
    new Devotionals(this.app)
  }
}
