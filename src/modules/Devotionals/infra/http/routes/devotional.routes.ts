import CreateDevotionalController from '@Modules/Devotionals/infra/http/controllers/CreateDevotionalController'
import DeleteDevotionalController from '@Modules/Devotionals/infra/http/controllers/DeleteDevotionalController'
import GetDevotionalBySlugController from '@Modules/Devotionals/infra/http/controllers/GetDevotionalBySlugController'
import GetDevotionalsAsAdminController from '@Modules/Devotionals/infra/http/controllers/GetDevotionalsAsAdminController'
import GetDevotionalsController from '@Modules/Devotionals/infra/http/controllers/GetDevotionalsController'
import LikeDevotionalController from '@Modules/Devotionals/infra/http/controllers/LikeDevotionalController'

import Middlewares from '@Shared/infra/http/middlewares'
import { Router } from 'express'

const DevotionalsRouter = Router()

DevotionalsRouter.route('/devotionals').get(GetDevotionalsController)
DevotionalsRouter.route('/devotionals/:slug').get(GetDevotionalBySlugController)
DevotionalsRouter.route('/admin/devotionals')
  .get(Middlewares.AdminPermissioner, GetDevotionalsAsAdminController)
  .post(
    Middlewares.AdminPermissioner,
    Middlewares.SingleFileUpload('coverImage'),
    CreateDevotionalController,
  )
DevotionalsRouter.route('/admin/devotionals/:id').delete(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  DeleteDevotionalController,
)
DevotionalsRouter.route('/devotionals/:id/like').put(
  Middlewares.Authentication,
  LikeDevotionalController,
)

export default DevotionalsRouter
