import { Express } from 'express'

import DevotionalsRouter from 'src/modules/Devotionals/infra/http/routes/devotional.routes'
import EventsRouter from 'src/modules/Events/infra/http/routes/events.routes'
import NewsRouter from 'src/modules/News/infra/http/routes/news.routes'
import RegionsRouter from 'src/modules/Regions/infra/http/routes/regions.routes'
import IntegrationsRouter from 'src/modules/Integrations/infra/http/routes/integrations.routes'
import StatsRouter from 'src/modules/Stats/infra/http/routes/stats.routes'
import UsersRouter from 'src/modules/Users/infra/http/routes/users.routes'
import Middlewares from 'src/shared/infra/http/middlewares'
import AuthenticationRouter from 'src/shared/modules/Authentication/infra/http/routes/authentication.routes'

export class ApplicationRouter {
  constructor(private readonly app: Express) {
    new Middlewares(this.app)

    this.app.use('/api', DevotionalsRouter)
    this.app.use('/api', EventsRouter)
    this.app.use('/api', NewsRouter)
    this.app.use('/api', RegionsRouter)
    this.app.use('/api', StatsRouter)
    this.app.use('/api', UsersRouter)
    this.app.use('/api', AuthenticationRouter)
    this.app.use('/api/integrations', IntegrationsRouter)
  }
}
