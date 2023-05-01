import { Router } from 'express'
import GetRegionsController from '@Modules/Regions/infra/http/controllers/GetRegionsController'

const RegionsRouter = Router()

RegionsRouter.route('/regions').get(GetRegionsController)

export default RegionsRouter
