import GetGrowthGroupsController from '@Modules/GrowthGroups/infra/http/controllers/GetGrowthGroupsController'
import { Router } from 'express'

const GrowthGroupsRouter = Router()

GrowthGroupsRouter.route('/growthgroups').get(GetGrowthGroupsController)

export default GrowthGroupsRouter
