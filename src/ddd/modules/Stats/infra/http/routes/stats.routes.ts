import Middlewares from '@Controllers/Middlewares'
import StatsController from '@Modules/Stats/infra/http/controllers/StatsController'
import { Router } from 'express'

const StatsRouter = Router()

StatsRouter.route('/stats').get(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  StatsController.getStats,
)

export default StatsRouter
