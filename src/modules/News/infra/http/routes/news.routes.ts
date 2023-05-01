import { Router } from 'express'
import Middlewares from '@Shared/infra/http/middlewares'
import GetNewsController from '@Modules/News/infra/http/controllers/GetNewsController'
import GetNewsAsAdminController from '@Modules/News/infra/http/controllers/GetNewsAsAdminController'
import CreateNewsController from '@Modules/News/infra/http/controllers/CreateNewsController'
import DeleteNewsController from '@Modules/News/infra/http/controllers/DeleteNewsController'
import GetNewsBySlugController from '@Modules/News/infra/http/controllers/GetNewsBySlugController'
import LikeNewsController from '@Modules/News/infra/http/controllers/LikeNewsController'

const NewsRouter = Router()

NewsRouter.route('/news').get(GetNewsController)

NewsRouter.route('/admin/news')
  .get(Middlewares.AdminPermissioner, GetNewsAsAdminController)
  .post(
    Middlewares.AdminPermissioner,
    Middlewares.SingleFileUpload('coverImage'),
    CreateNewsController,
  )

NewsRouter.route('/news/:id').delete(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  DeleteNewsController,
)

NewsRouter.route('/news/:slug').get(GetNewsBySlugController)

NewsRouter.route('/news/:id/like').post(
  Middlewares.Authentication,
  LikeNewsController,
)

export default NewsRouter
