import { Router } from 'express'

import DevotionalsController from '@Modules/Devotionals/infra/http/controllers/DevotionalsController'
import Middlewares from '@Controllers/Middlewares'

const DevotionalsRouter = Router()

DevotionalsRouter.route('/devotionals').get(DevotionalsController.getDevotionals)

DevotionalsRouter.route('/devotionals/:slug').get(DevotionalsController.getDevotionalBySlug)

DevotionalsRouter.route('/admin/devotionals').get(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  DevotionalsController.getDevotionalsAsAdmin,
)
DevotionalsRouter.route('/admin/devotionals').post(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  Middlewares.SingleFileUpload,
  DevotionalsController.createDevotional,
)
DevotionalsRouter.route('admin/devotionals/:id').delete(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  DevotionalsController.deleteDevotional,
)
DevotionalsRouter.route('/devotionals/:id/like').put(
  Middlewares.Authentication,
  DevotionalsController.like,
)

export default DevotionalsRouter
