import GetStatsController from '@Modules/Stats/infra/http/controllers/GetStatsController'
import Middlewares from '@Shared/infra/http/middlewares'

import { Router } from 'express'

const StatsRouter = Router()

StatsRouter.route('/stats').get(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  GetStatsController,
)

export default StatsRouter
