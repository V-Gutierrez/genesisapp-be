import Middlewares from '@Shared/infra/http/middlewares'

import StatsController from 'src/modules/Stats/infra/http/controllers/StatsController'
import { Router } from 'express'

const StatsRouter = Router()

StatsRouter.route('/stats').get(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  StatsController.getStats,
)

export default StatsRouter
