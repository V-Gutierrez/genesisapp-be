import Middlewares from '@Controllers/Middlewares'
import NewsController from '@Modules/News/infra/http/controllers/NewsController'
import { Router } from 'express'

const NewsRouter = Router()

NewsRouter.route('/news').post(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  Middlewares.SingleFileUpload('coverImage'),
  NewsController.createNews,
)

NewsRouter.route('/news/:id').delete(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  NewsController.deleteNews,
)

NewsRouter.route('/admin/news').get(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  NewsController.getNewsAsAdmin,
)

NewsRouter.route('/news').get(NewsController.getNews)
NewsRouter.route('/news/:slug').get(NewsController.getNewsBySlug)
NewsRouter.route('/news/:id/like').get(Middlewares.Authentication, NewsController.like)

export default NewsRouter
