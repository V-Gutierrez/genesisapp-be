import IntegrationsController from '@Modules/Integrations/infra/http/controllers/IntegrationsController'
import { Router } from 'express'

const IntegrationsRouter = Router()

IntegrationsRouter.route('/googlephotos').get(IntegrationsController.getGooglePhotosAlbumPhotos)

export default IntegrationsRouter
