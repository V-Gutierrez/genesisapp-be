import { Router } from 'express'
import GetGalleriesController from '../controllers/GetGalleriesController'

const GalleriesRouter = Router()

GalleriesRouter.route('/galleries').get(GetGalleriesController)

export default GalleriesRouter
