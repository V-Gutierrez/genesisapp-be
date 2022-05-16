import Devotionals from '@Controllers/RoutesController/resources/Devotionals'
import { Express } from 'express'
import GrowthGroups from '@Controllers/RoutesController/resources/GrowthGroups'
import Middlewares from '@Controllers/RoutesController/Middlewares'

export default class RoutesController {
  constructor(private readonly app: Express) {
    new Middlewares(this.app)
    new GrowthGroups(this.app)
    new Devotionals(this.app)
  }
}
