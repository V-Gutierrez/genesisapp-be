import { Router } from 'express'
import GetGalleriesController from '../controllers/GetGalleriesController'
import GetGalleryByIdController from '../controllers/GetGalleryByIdController'
import LikeGalleryController from '../controllers/LikeGalleryController'
import DeleteGalleryByIdController from '../controllers/DeleteGalleryByIdController'

const GalleriesRouter = Router()

GalleriesRouter.route('/galleries').get(GetGalleriesController)

GalleriesRouter.route('/galleries/:id')
  .get(GetGalleryByIdController)
  .delete(DeleteGalleryByIdController)

GalleriesRouter.route('/galleries/:id/like').post(LikeGalleryController)

export default GalleriesRouter
