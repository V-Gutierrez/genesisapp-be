import Middlewares from '@Controllers/Middlewares'
import EventsController from '@Modules/Events/infra/http/controllers/EventsController'
import { Router } from 'express'

const EventsRouter = Router()

EventsRouter.route('/events').get(EventsController.getEvents)
EventsRouter.route('/events/:id').get(EventsController.getEventById)

EventsRouter.route('/admin/events').post(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  Middlewares.SingleFileUpload('coverImage'),
  EventsController.createEvent,
)

EventsRouter.route('/admin/events').get(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  Middlewares.SingleFileUpload('coverImage'),
  EventsController.getEventsAsAdmin,
)

EventsRouter.route('/admin/events/:id').delete(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  EventsController.deleteEvent,
)

EventsRouter.route('/events/:eventId/subscriptions').post(EventsController.subscribeToEvent)

EventsRouter.route('/admin/subscriptions/:id').delete(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  EventsController.deleteSubscription,
)

export default EventsRouter
