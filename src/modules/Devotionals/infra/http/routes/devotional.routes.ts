import GetDevotionalBySlugController from '@Modules/Devotionals/infra/http/controllers/GetDevotionalBySlugController'
import GetDevotionalsController from '@Modules/Devotionals/infra/http/controllers/GetDevotionalsController'
import LikeDevotionalController from '@Modules/Devotionals/infra/http/controllers/LikeDevotionalController'

import Middlewares from '@Shared/infra/http/middlewares'
import { Router } from 'express'

const DevotionalsRouter = Router()

DevotionalsRouter.route('/devotionals').get(GetDevotionalsController)
DevotionalsRouter.route('/devotionals/:slug').get(GetDevotionalBySlugController)
DevotionalsRouter.route('/devotionals/:id/like').put(
  Middlewares.Authentication,
  LikeDevotionalController,
)

export default DevotionalsRouter
