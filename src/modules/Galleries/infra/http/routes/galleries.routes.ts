import { Router } from 'express'
import GetGalleriesController from '../controllers/GetGalleriesController'
import GetGalleryByIdController from '../controllers/GetGalleryByIdController'

const GalleriesRouter = Router()

GalleriesRouter.route('/galleries').get(GetGalleriesController)
GalleriesRouter.route('/galleries/:id').get(GetGalleryByIdController)

export default GalleriesRouter
