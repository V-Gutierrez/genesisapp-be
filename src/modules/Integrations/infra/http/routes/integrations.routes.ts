import GetGooglePhotosAlbumPhotosController from '@Modules/Integrations/infra/http/controllers/GetGooglePhotosAlbumPhotosController'
import { Router } from 'express'

const IntegrationsRouter = Router()

IntegrationsRouter.route('/googlephotos').get(GetGooglePhotosAlbumPhotosController)

export default IntegrationsRouter
