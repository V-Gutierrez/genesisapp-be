import { Express, Request, Response } from 'express'

import { ImageKitFolders } from '@Types/Enum'
import ImageKitService from '@Services/ImageKitService'
import Middlewares from '@Controllers/Middlewares'
import Prisma from '@Clients/Prisma'
import SchemaHelper from '@Helpers/SchemaHelper'
import { generateSlug } from '@Helpers/Utils'
import { zonedTimeToUtc } from 'date-fns-tz'

class ExternalEvent {
  static getEvents(app: Express) {
    app.get('/api/externalevents', async (_req: Request, res: Response) => {
      try {
        const externalEvents = await Prisma.externalEvent.findMany({
          include: {
            subscriptions: true,
          },
        })

        res.status(200).json(externalEvents)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static createEvent(app: Express) {
    app.post(
      '/api/externalevents',
      Middlewares.SingleFileUpload('coverImage'),
      async (req: Request, res: Response) => {
        try {
          const errors = SchemaHelper.validateSchema(SchemaHelper.EXTERNAL_EVENT_CREATION, req.body)

          if (errors) return res.status(400).json({ error: errors })

          if (!req.file) {
            return res.status(400).json({ error: 'coverImage is missing' })
          }

          const { title, description, scheduledTo, lat, lng, addressInfo, maxSubscriptions } =
            req.body
          const { file } = req

          const {
            url: coverImage,
            thumbnailUrl: coverThumbnail,
            fileId,
          } = await ImageKitService.uploadFile(
            file.buffer,
            generateSlug(title),
            ImageKitFolders.ExternalEvents,
          )

          const externalEvent = await Prisma.externalEvent.create({
            data: {
              title,
              description,
              scheduledTo: zonedTimeToUtc(new Date(scheduledTo), 'America/Sao_Paulo'),
              lat: Number(lat),
              lng: Number(lng),
              addressInfo,
              maxSubscriptions: Number(maxSubscriptions),
              coverImage,
              coverThumbnail,
              assetId: fileId,
            },
          })

          res.status(201).json({ externalEvent })
        } catch (error) {
          console.log('🚀 ~ file: index.ts ~ line 70 ~ ExternalEvent ~ app.post ~ error', error)
          res.sendStatus(500)
        }
      },
    )
  }

  static deleteEvent(app: Express) {
    app.delete('/api/externalevents/:id', async (req: Request, res: Response) => {
      const { id } = req.params

      try {
        const deleted = await Prisma.externalEvent.delete({
          where: { id },
        })

        await ImageKitService.delete(deleted.assetId)

        res.status(204)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static subscribeToExternalEvent(app: Express) {
    app.post('/api/externalevents/:id', async (req: Request, res: Response) => {
      try {
        const errors = SchemaHelper.validateSchema(
          SchemaHelper.EXTERNAL_EVENT_SUBSCRIPTION,
          req.body,
        )
        if (errors) return res.status(400).json({ error: errors })

        const { name, email, phone } = req.body
        const { id } = req.params

        const externalEvent = await Prisma.externalEvent.findFirst({
          where: { id },
          include: { subscriptions: true },
        })

        if (externalEvent && externalEvent.subscriptions.length < externalEvent.maxSubscriptions) {
          await Prisma.externalSubscriptions.create({
            data: {
              name,
              email,
              phone,
              externalEventId: externalEvent.id,
            },
          })

          return res.status(201).json({ message: 'Subscription successful' })
        } 
          return res.status(409).json({ message: 'Subscription limit reached' })
        
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}

export default ExternalEvent
