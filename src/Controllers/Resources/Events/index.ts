import { Express, Request, Response } from 'express'
import EventsModel from '@Models/Events'
import SchemaHelper from '@Helpers/SchemaHelper'
import Middlewares from '@Controllers/Middlewares'
import Formatter from '@Helpers/Formatter'
import ImageKitService from '@Services/ImageKitService'
import { ImageKitFolders } from '@Types/Enum'

class Events {
  static getEvents(app: Express) {
    app.get('/api/events', async (_req: Request, res: Response) => {
      try {
        const response = await EventsModel.getReleasedEvents()

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
            return res.status(400).json({ error: errors })
          }
          if (!req.file) {
            return res.status(400).json({ error: 'coverImage is missing' })
          }

          const { title, scheduledTo, maxSlots, description } = req.body
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
            scheduledTo,
            description,
            maxSlots,
            coverImage,
            coverThumbnail,
            assetId: fileId,
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

        res.sendStatus(204)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static getEventsAsAdmin(app: Express) {
    app.get('/api/all-events', async (_req: Request, res: Response) => {
      try {
        const response = await EventsModel.getAll()

        res.status(200).json(response)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static subscribeToEvent(app: Express) {
    app.post('/api/events/:id', async (req: Request, res: Response) => {
      try {
        const errors = SchemaHelper.validateSchema(SchemaHelper.EVENTS_SUBSCRIPTION, req.body)

        if (errors) {
          return res.status(400).json({ error: errors })
        }
        const { id } = req.params
        const { userName, userEmail, userPhone } = req.body

        await EventsModel.subscribeUserToEvent(
          {
            userName,
            userEmail,
            userPhone,
          },
          id,
        )

        res.sendStatus(201)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static deleteSubscription(app: Express) {
    app.delete('/api/events/subscriptions/:id', async (req: Request, res: Response) => {
      try {
        const { id } = req.params

        const deletedSubscription = await EventsModel.removeSubscriptionById(id)

        res.sendStatus(204)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}

export default Events
