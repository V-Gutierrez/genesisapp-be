import RegionsController from '@Modules/Regions/infra/http/controllers/RegionsController'
import { Router } from 'express'

const RegionsRouter = Router()

RegionsRouter.route('/regions').get(RegionsController.getRegions)

export default RegionsRouter
