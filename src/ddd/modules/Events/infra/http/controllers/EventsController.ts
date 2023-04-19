import { Request, Response } from 'express'
import SchemaHelper from '@Helpers/SchemaHelper'
import Formatter from '@Helpers/Formatter'
import ImageKitService from '@Services/ImageKitService'
import { ImageKitFolders } from '@Types/Enum'
import { TIMEZONE } from '@Constants/index'
import { zonedTimeToUtc } from 'date-fns-tz'
import { Success } from '@Helpers/Messages'
import EventsRepository from '@Modules/Events/domain/repositories/EventsRepository'

class EventsController {
  static async getEvents(req: Request, res: Response) {
    const { region } = req.cookies.user ?? {}

    try {
      const response = await EventsRepository.getReleasedEvents(region)

      res.status(200).json(response)
    } catch (error) {
      res.sendStatus(500)
    }
  }

  static async getEventById(req: Request, res: Response) {
    const { region } = req.cookies.user ?? {}

    try {
      const { id } = req.params
      const response = await EventsRepository.getEventById(id, region)

      res.status(200).json(response)
    } catch (error) {
      res.sendStatus(500)
    }
  }

  static async createEvent(req: Request, res: Response) {
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

      const newEvent = await EventsRepository.create({
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
  }

  static async deleteEvent(req: Request, res: Response) {
    try {
      const { id } = req.params

      const deleted = await EventsRepository.deleteById(id)

      await ImageKitService.delete(deleted.assetId)

      res.status(200).json({ message: Success.RESOURCE_DELETED })
    } catch (error) {
      res.sendStatus(500)
    }
  }

  static async getEventsAsAdmin(req: Request, res: Response) {
    try {
      const response = await EventsRepository.getAll()

      res.status(200).json(response)
    } catch (error) {
      res.sendStatus(500)
    }
  }

  static async subscribeToEvent(req: Request, res: Response) {
    try {
      const errors = SchemaHelper.validateSchema(SchemaHelper.EVENTS_SUBSCRIPTION, req.body)

      if (errors) {
        return res.status(400).json({ message: errors })
      }

      const { eventId } = req.params
      const { userName, userEmail, userPhone } = req.body
      const { region } = req.cookies.user ?? {}

      await EventsRepository.subscribeUserToEvent(
        {
          userName,
          userEmail,
          userPhone,
        },
        eventId,
        region,
      )

      res.status(201).json({ message: Success.SUBSCRIPTION_CREATED })
    } catch (error) {
      res.sendStatus(500)
    }
  }

  static async deleteSubscription(req: Request, res: Response) {
    try {
      const { id } = req.params

      await EventsRepository.removeSubscriptionById(id)

      res.status(200).json({ message: Success.RESOURCE_DELETED })
    } catch (error) {
      res.sendStatus(500)
    }
  }
}

export default EventsController
