import GetEventByIdController from '@Modules/Events/infra/http/controllers/GetEventByIdController'
import GetEventsController from '@Modules/Events/infra/http/controllers/GetEventsController'
import SubscribeToEventController from '@Modules/Events/infra/http/controllers/SubscribeToEventController'
import { Router } from 'express'

const EventsRouter = Router()

EventsRouter.route('/events').get(GetEventsController)
EventsRouter.route('/events/:id').get(GetEventByIdController)
EventsRouter.route('/events/:eventId/subscriptions').post(SubscribeToEventController)

export default EventsRouter
