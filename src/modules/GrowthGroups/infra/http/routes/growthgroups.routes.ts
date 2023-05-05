import CreateGrowthGroupController from '@Modules/GrowthGroups/infra/http/controllers/CreateGrowthGroupController'
import GetGrowthGroupsController from '@Modules/GrowthGroups/infra/http/controllers/GetGrowthGroupsController'
import Middlewares from '@Shared/infra/http/middlewares'
import { Router } from 'express'

const GrowthGroupsRouter = Router()

GrowthGroupsRouter.route('/growthgroups').get(GetGrowthGroupsController)

GrowthGroupsRouter.route('/admin/growthgroups').post(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  CreateGrowthGroupController,
)

export default GrowthGroupsRouter
