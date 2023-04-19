import Authentication from '@Controllers/Authentication'
import { Express } from 'express'
// import GrowthGroups from '@Controllers/Resources/GrowthGroups'
import Integrations from '@Controllers/Resources/Integrations'
import Middlewares from '@Controllers/Middlewares'
import News from '@Controllers/Resources/News'
import Stats from '@Controllers/Resources/Stats'
import Users from '@Controllers/Resources/Users'
import Regions from '@Controllers/Resources/Regions'
import DevotionalsRouter from '@Modules/Devotionals/infra/http/routes/devotional.routes'
import EventsRouter from '@Modules/Events/infra/http/routes/events.routes'

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

    // GrowthGroups.getGrowthGroups(this.app)

    News.getNews(this.app)
    News.getNewsBySlug(this.app)
    News.like(this.app)

    Users.signUp(this.app)

    Integrations.getGooglePhotosAlbumPhotos(this.app)
    Regions.getRegions(this.app)

    /* AUTH ROUTES */
    Middlewares.JWT(this.app)
    Authentication.getUserInformation(this.app)
    Users.get(this.app)

    /* AUTH ROUTES */

    /* ADMIN ROUTES */
    Middlewares.IsAdmin(this.app)

    News.createNews(this.app)
    News.deleteNews(this.app)
    News.getNewsAsAdmin(this.app)

    Users.getAllUsersAsAdmin(this.app)

    Stats.getStats(this.app)
    /* ADMIN ROUTES */
  }
}
