import Authentication from '@Controllers/Authentication'
import Devotionals from '@Controllers/Resources/Devotionals'
import { Express } from 'express'
import ExternalEvent from '@Controllers/Resources/ExternalEvent'
import GrowthGroups from '@Controllers/Resources/GrowthGroups'
import Middlewares from '@Controllers/Middlewares'
import Stats from '@Controllers/Resources/Stats'
import Users from '@Controllers/Resources/Users'

export default class RoutesController {
  constructor(private readonly app: Express) {
    new Middlewares(this.app)

    Authentication.authenticate(this.app)
    Authentication.refreshToken(this.app)
    Authentication.activateNewUser(this.app)
    Authentication.resetPassword(this.app)
    Authentication.setNewPassword(this.app)
    Authentication.logout(this.app)
    Authentication.getUserInformation(this.app)

    ExternalEvent.subscribeToExternalEvent(this.app)
    ExternalEvent.getEventBySlug(this.app)

    GrowthGroups.getGrowthGroups(this.app)
    Devotionals.getDevotionals(this.app)
    Devotionals.getDevotionalBySlug(this.app)

    Users.signUp(this.app)

    Middlewares.JWT(this.app)
    /* AUTH ROUTES */
    Users.get(this.app)

    Middlewares.IsAdmin(this.app)
    /* ADMIN ROUTES */
    ExternalEvent.createEvent(this.app)
    ExternalEvent.deleteEvent(this.app)
    ExternalEvent.deleteSubscription(this.app)
    ExternalEvent.getEvents(this.app)

    Devotionals.createDevotional(this.app)
    Devotionals.getDevotionalsAsAdmin(this.app)
    Devotionals.deleteDevocional(this.app)
    Stats.getStats(this.app)
  }
}
