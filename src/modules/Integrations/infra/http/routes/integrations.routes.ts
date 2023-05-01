import GooglePhotosIntegrationController from '@Modules/Integrations/infra/http/controllers/GooglePhotosIntegrationController'
import { Router } from 'express'

const IntegrationsRouter = Router()

IntegrationsRouter.route('/googlephotos').get(GooglePhotosIntegrationController)

export default IntegrationsRouter
