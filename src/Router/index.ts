import Authentication from '@Controllers/Authentication'
import Devotionals from '@Controllers/Resources/Devotionals'
import { Express } from 'express'
import GrowthGroups from '@Controllers/Resources/GrowthGroups'
import Integrations from '@Controllers/Resources/Integrations'
import Middlewares from '@Controllers/Middlewares'
import News from '@Controllers/Resources/News'
import Stats from '@Controllers/Resources/Stats'
import Users from '@Controllers/Resources/Users'
import Events from '@Controllers/Resources/Events'
import Regions from '@Controllers/Resources/Regions'

export default class RoutesController {
  constructor(private readonly app: Express) {
    new Middlewares(this.app)

    Authentication.authenticate(this.app)
    Authentication.refreshToken(this.app)
    Authentication.activateNewUser(this.app)
    Authentication.resetPassword(this.app)
    Authentication.setNewPassword(this.app)
    Authentication.logout(this.app)

    GrowthGroups.getGrowthGroups(this.app)
    Devotionals.getDevotionals(this.app)
    Devotionals.getDevotionalBySlug(this.app)

    News.getNews(this.app)
    News.getNewsBySlug(this.app)
    News.like(this.app)

    Users.signUp(this.app)

    Events.subscribeToEvent(this.app)
    Events.getEvents(this.app)
    Events.getEventById(this.app)

    Integrations.getGooglePhotosAlbumPhotos(this.app)
    Regions.getRegions(this.app)

    /* AUTH ROUTES */
    Middlewares.JWT(this.app)
    Authentication.getUserInformation(this.app)
    Users.get(this.app)
    Devotionals.like(this.app)
    /* AUTH ROUTES */

    /* ADMIN ROUTES */
    Middlewares.IsAdmin(this.app)
    Events.getEventsAsAdmin(this.app)
    Events.createEvent(this.app)
    Events.deleteEvent(this.app)
    Events.deleteSubscription(this.app)

    News.createNews(this.app)
    News.deleteNews(this.app)
    News.getNewsAsAdmin(this.app)

    Users.getAllUsersAsAdmin(this.app)
    Devotionals.createDevotional(this.app)
    Devotionals.getDevotionalsAsAdmin(this.app)
    Devotionals.deleteDevotional(this.app)
    Stats.getStats(this.app)
    /* ADMIN ROUTES */
  }
}
