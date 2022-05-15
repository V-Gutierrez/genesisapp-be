import GrowthGroupsRoutes from '@Controllers/RoutesController/GrowthGroupsRoutes'
import Middlewares from '@Controllers/RoutesController/Middlewares'
import { Express } from 'express'

export default class RoutesController {
  constructor(private readonly app: Express) {
    new Middlewares(this.app)
    new GrowthGroupsRoutes(this.app)
  }
}
