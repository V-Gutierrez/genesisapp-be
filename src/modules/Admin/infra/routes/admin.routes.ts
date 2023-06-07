import { Router } from 'express'

import CreateDevotionalController from '@Modules/Devotionals/infra/http/controllers/CreateDevotionalController'
import DeleteDevotionalController from '@Modules/Devotionals/infra/http/controllers/DeleteDevotionalController'
import GetDevotionalsAsAdminController from '@Modules/Devotionals/infra/http/controllers/GetDevotionalsAsAdminController'
import CreateEventController from '@Modules/Events/infra/http/controllers/CreateEventController'
import DeleteEventController from '@Modules/Events/infra/http/controllers/DeleteEventController'
import DeleteEventSubscriptionController from '@Modules/Events/infra/http/controllers/DeleteEventSubscriptionController'
import GetEventsAsAdminController from '@Modules/Events/infra/http/controllers/GetEventsAsAdminController'
import Middlewares from '@Shared/infra/http/middlewares'
import GetNewsAsAdminController from '@Modules/News/infra/http/controllers/GetNewsAsAdminController'
import CreateNewsController from '@Modules/News/infra/http/controllers/CreateNewsController'
import GetAllUsersAsAdminController from '@Modules/Users/infra/http/controllers/GetAllUsersAsAdminController'
import CreateGalleryController from '@Modules/Galleries/infra/http/controllers/CreateGalleryController'
import DeleteGalleryByIdController from '@Modules/Galleries/infra/http/controllers/DeleteGalleryByIdController'

const AdminRouter = Router()

AdminRouter.route('/admin/devotionals')
  .get(Middlewares.AdminPermissioner, GetDevotionalsAsAdminController)
  .post(
    Middlewares.AdminPermissioner,
    Middlewares.SingleFileUpload('coverImage'),
    CreateDevotionalController,
  )

AdminRouter.route('/admin/devotionals/:id').delete(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  DeleteDevotionalController,
)

AdminRouter.route('/admin/events')
  .get(Middlewares.AdminPermissioner, GetEventsAsAdminController)
  .post(
    Middlewares.AdminPermissioner,
    Middlewares.SingleFileUpload('coverImage'),
    CreateEventController,
  )

AdminRouter.route('/admin/events/:id').delete(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  DeleteEventController,
)

AdminRouter.route('/admin/subscriptions/:id').delete(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  DeleteEventSubscriptionController,
)

AdminRouter.route('/admin/news')
  .get(Middlewares.AdminPermissioner, GetNewsAsAdminController)
  .post(
    Middlewares.AdminPermissioner,
    Middlewares.SingleFileUpload('coverImage'),
    CreateNewsController,
  )

AdminRouter.route('/admin/users').get(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  GetAllUsersAsAdminController,
)

AdminRouter.route('/admin/galleries').post(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  Middlewares.SingleFileUpload('coverImage'),
  CreateGalleryController,
)

AdminRouter.route('/admin/galleries/:id').delete(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  DeleteGalleryByIdController,
)

export default AdminRouter
