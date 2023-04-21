import GrowthGroupsController from 'src/modules/GrowthGroups/infra/http/controllers/GrowthGroupsController'
import { Router } from 'express'

const GrowthGroupsRouter = Router()

GrowthGroupsRouter.route('/growthgroups').get(
  GrowthGroupsController.getGrowthGroups,
)

export default GrowthGroupsRouter
