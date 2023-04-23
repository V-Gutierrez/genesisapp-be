import Middlewares from '@Shared/infra/http/middlewares'
import { Router } from 'express'

import DevotionalsController from 'src/modules/Devotionals/infra/http/controllers/DevotionalsController'

const DevotionalsRouter = Router()

DevotionalsRouter.route('/devotionals').get(
  DevotionalsController.getDevotionals,
)

DevotionalsRouter.route('/devotionals/:slug').get(
  DevotionalsController.getDevotionalBySlug,
)

DevotionalsRouter.route('/admin/devotionals')
  .post(
    Middlewares.AdminPermissioner,
    Middlewares.SingleFileUpload,
    DevotionalsController.createDevotional,
  )
  .get(
    Middlewares.AdminPermissioner,
    DevotionalsController.getDevotionalsAsAdmin,
  )

DevotionalsRouter.route('/admin/devotionals/:id').delete(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  DevotionalsController.deleteDevotional,
)
DevotionalsRouter.route('/devotionals/:id/like').put(
  Middlewares.Authentication,
  DevotionalsController.like,
)

export default DevotionalsRouter
