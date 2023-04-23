import NewsController from 'src/modules/News/infra/http/controllers/NewsController'
import { Router } from 'express'
import Middlewares from '@Shared/infra/http/middlewares'

const NewsRouter = Router()

NewsRouter.route('/news').get(NewsController.getNews)

NewsRouter.route('/admin/news')
  .get(Middlewares.AdminPermissioner, NewsController.getNewsAsAdmin)
  .post(
    Middlewares.AdminPermissioner,
    Middlewares.SingleFileUpload('coverImage'),
    NewsController.createNews,
  )

NewsRouter.route('/news/:id').delete(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  NewsController.deleteNews,
)

NewsRouter.route('/news/:slug').get(NewsController.getNewsBySlug)

NewsRouter.route('/news/:id/like').post(
  Middlewares.Authentication,
  NewsController.like,
)

export default NewsRouter
