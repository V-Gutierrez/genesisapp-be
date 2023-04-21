import Authentication from '@Controllers/Authentication'
import { Express } from 'express'

import DevotionalsRouter from '@Modules/Devotionals/infra/http/routes/devotional.routes'
import EventsRouter from '@Modules/Events/infra/http/routes/events.routes'
import NewsRouter from '@Modules/News/infra/http/routes/news.routes'
import RegionsRouter from '@Modules/Regions/infra/http/routes/regions.routes'
import IntegrationsRouter from '@Modules/Integrations/infra/http/routes/integrations.routes'
import StatsRouter from '@Modules/Stats/infra/http/routes/stats.routes'
import UsersRouter from '@Modules/Users/infra/http/routes/users.routes'
import Middlewares from '@Shared/infra/middlewares'

export default class RoutesController {
  constructor(private readonly app: Express) {
    new Middlewares(this.app)

    Authentication.authenticate(this.app)
    Authentication.refreshToken(this.app)
    Authentication.activateNewUser(this.app)
    Authentication.resetPassword(this.app)
    Authentication.setNewPassword(this.app)
    Authentication.logout(this.app)

    this.app.use('/api', DevotionalsRouter)
    this.app.use('/api', EventsRouter)
    this.app.use('/api', NewsRouter)
    this.app.use('/api', RegionsRouter)
    this.app.use('/api', StatsRouter)
    this.app.use('/api/integrations', IntegrationsRouter)
    this.app.use('/api', UsersRouter)

    /* AUTH ROUTES */
    Authentication.getUserInformation(this.app)

    /* AUTH ROUTES */
  }
}
