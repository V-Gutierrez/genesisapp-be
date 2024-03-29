import CreateGrowthGroupController from '@Modules/GrowthGroups/infra/http/controllers/CreateGrowthGroupController'
import DeleteGrowthGroupController from '@Modules/GrowthGroups/infra/http/controllers/DeleteGrowthGroupController'
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

GrowthGroupsRouter.route('/admin/growthgroups/:id').delete(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  DeleteGrowthGroupController,
)

export default GrowthGroupsRouter
