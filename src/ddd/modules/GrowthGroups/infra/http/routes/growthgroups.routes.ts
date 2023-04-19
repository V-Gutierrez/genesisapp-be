import GrowthGroupsController from '@Modules/GrowthGroups/infra/http/controllers/GrowthGroupsController'
import { Router } from 'express'

const GrowthGroupsRouter = Router()

GrowthGroupsRouter.route('/growthgroups').get(GrowthGroupsController.getGrowthGroups)

export default GrowthGroupsRouter
