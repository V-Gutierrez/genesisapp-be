import EventsController from 'src/modules/Events/infra/http/controllers/EventsController'
import { Router } from 'express'
import Middlewares from '@Shared/infra/http/middlewares'

const EventsRouter = Router()

EventsRouter.route('/events').get(EventsController.getEvents)
EventsRouter.route('/events/:id').get(EventsController.getEventById)

EventsRouter.route('/admin/events')
  .get(
    Middlewares.AdminPermissioner,
    Middlewares.SingleFileUpload('coverImage'),
    EventsController.getEventsAsAdmin,
  )
  .post(
    Middlewares.AdminPermissioner,
    Middlewares.SingleFileUpload('coverImage'),
    EventsController.createEvent,
  )

EventsRouter.route('/admin/events/:id').delete(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  EventsController.deleteEvent,
)

EventsRouter.route('/events/:eventId/subscriptions').post(
  EventsController.subscribeToEvent,
)

EventsRouter.route('/admin/subscriptions/:id').delete(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  EventsController.deleteSubscription,
)

export default EventsRouter
