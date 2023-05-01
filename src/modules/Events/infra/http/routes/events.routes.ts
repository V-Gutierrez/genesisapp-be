import CreateEventController from '@Modules/Events/infra/http/controllers/CreateEventController'
import DeleteEventController from '@Modules/Events/infra/http/controllers/DeleteEventController'
import DeleteEventSubscriptionController from '@Modules/Events/infra/http/controllers/DeleteEventSubscriptionController'
import GetEventByIdController from '@Modules/Events/infra/http/controllers/GetEventByIdController'
import GetEventsAsAdminController from '@Modules/Events/infra/http/controllers/GetEventsAsAdminController'
import GetEventsController from '@Modules/Events/infra/http/controllers/GetEventsController'
import SubscribeToEventController from '@Modules/Events/infra/http/controllers/SubscribeToEventController'
import Middlewares from '@Shared/infra/http/middlewares'
import { Router } from 'express'

const EventsRouter = Router()

EventsRouter.route('/events').get(GetEventsController)
EventsRouter.route('/events/:id').get(GetEventByIdController)

EventsRouter.route('/admin/events')
  .get(Middlewares.AdminPermissioner, GetEventsAsAdminController)
  .post(
    Middlewares.AdminPermissioner,
    Middlewares.SingleFileUpload('coverImage'),
    CreateEventController,
  )

EventsRouter.route('/admin/events/:id').delete(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  DeleteEventController,
)

EventsRouter.route('/events/:eventId/subscriptions').post(
  SubscribeToEventController,
)

EventsRouter.route('/admin/subscriptions/:id').delete(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  DeleteEventSubscriptionController,
)

export default EventsRouter
