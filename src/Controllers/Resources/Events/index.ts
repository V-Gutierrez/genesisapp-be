import { Express, Request, Response } from 'express'
import EventsModel from '@Models/Events'
import SchemaHelper from '@Helpers/SchemaHelper'
import Middlewares from '@Controllers/Middlewares'
import Formatter from '@Helpers/Formatter'
import ImageKitService from '@Services/ImageKitService'
import { ImageKitFolders } from '@Types/Enum'
import { TIMEZONE } from '@Constants/index'
import { zonedTimeToUtc } from 'date-fns-tz'
import { Success } from '@Helpers/Messages'

class Events {
  static getEvents(app: Express) {
    app.get('/api/events', async (req: Request, res: Response) => {
      const { region } = req.cookies.user ?? {}

      try {
        const response = await EventsModel.getReleasedEvents(region)

        res.status(200).json(response)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static getEventById(app: Express) {
    app.get('/api/events/:id', async (req: Request, res: Response) => {
      const { region } = req.cookies.user ?? {}

      try {
        const { id } = req.params
        const response = await EventsModel.getEventById(id, region)

        res.status(200).json(response)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static createEvent(app: Express) {
    app.post(
      '/api/events',
      Middlewares.SingleFileUpload('coverImage'),
      async (req: Request, res: Response) => {
        try {
          const errors = SchemaHelper.validateSchema(SchemaHelper.EVENTS_CREATION, req.body)

          if (errors) {
            return res.status(400).json({ message: errors })
          }
          if (!req.file) {
            return res.status(400).json({ message: 'coverImage is missing' })
          }

          const { region } = req.cookies.user ?? {}

          const {
            title,
            subscriptionsScheduledTo,
            subscriptionsDueDate,
            eventDate,
            maxSlots,
            description,
          } = req.body
          const { file } = req

          const {
            url: coverImage,
            thumbnailUrl: coverThumbnail,
            fileId,
          } = await ImageKitService.uploadFile(
            file.buffer,
            Formatter.generateSlug(title),
            ImageKitFolders.Events,
          )

          const newEvent = await EventsModel.create({
            title,
            subscriptionsScheduledTo: zonedTimeToUtc(new Date(subscriptionsScheduledTo), TIMEZONE),
            subscriptionsDueDate: zonedTimeToUtc(new Date(subscriptionsDueDate), TIMEZONE),
            eventDate: zonedTimeToUtc(new Date(eventDate), TIMEZONE),
            description,
            maxSlots: Number(maxSlots),
            coverImage,
            coverThumbnail,
            assetId: fileId,
            region,
          })

          return res.status(201).json(newEvent)
        } catch (err) {
          res.sendStatus(500)
        }
      },
    )
  }

  static deleteEvent(app: Express) {
    app.delete('/api/events/:id', async (req: Request, res: Response) => {
      try {
        const { id } = req.params

        const deleted = await EventsModel.deleteById(id)

        await ImageKitService.delete(deleted.assetId)

        res.status(200).json({ message: Success.RESOURCE_DELETED })
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static getEventsAsAdmin(app: Express) {
    app.get('/api/all-events', async (req: Request, res: Response) => {
      try {
        const response = await EventsModel.getAll()

        res.status(200).json(response)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static subscribeToEvent(app: Express) {
    app.post('/api/events/subscriptions/:id', async (req: Request, res: Response) => {
      try {
        const errors = SchemaHelper.validateSchema(SchemaHelper.EVENTS_SUBSCRIPTION, req.body)

        if (errors) {
          return res.status(400).json({ message: errors })
        }
        const { id } = req.params
        const { userName, userEmail, userPhone } = req.body
        const { region } = req.cookies.user ?? {}

        await EventsModel.subscribeUserToEvent(
          {
            userName,
            userEmail,
            userPhone,
          },
          id,
          region,
        )

        res.status(201).json({ message: Success.SUBSCRIPTION_CREATED })
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static deleteSubscription(app: Express) {
    app.delete('/api/events/subscriptions/:id', async (req: Request, res: Response) => {
      try {
        const { id } = req.params

        await EventsModel.removeSubscriptionById(id)

        res.status(200).json({ message: Success.RESOURCE_DELETED })
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}

export default Events
