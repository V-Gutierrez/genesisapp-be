import EventsRepository from '@Modules/Events/domain/repositories/EventsRepository'
import { TIMEZONE } from '@Shared/constants'
import Formatter from '@Shared/helpers/Formatter'
import SchemaHelper from '@Shared/helpers/SchemaHelper'
import ImageKit from '@Shared/services/ImageKit'
import { ImageKitFolders } from '@Shared/types/Enum'
import { HTTPController } from '@Shared/types/interfaces'
import { zonedTimeToUtc } from 'date-fns-tz'
import { Request, Response } from 'express'

export class CreateEventController implements HTTPController {
  async execute(req: Request, res: Response) {
    try {
      const errors = SchemaHelper.validateSchema(SchemaHelper.EVENTS_CREATION, req.body)

      if (errors) {
        res.status(400).json({ message: errors })
        return
      }
      if (!req.file) {
        res.status(400).json({ message: 'coverImage is missing' })
        return
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
      } = await ImageKit.uploadFile(
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

      res.status(201).json(newEvent)
    } catch (err) {
      res.sendStatus(500)
    }
  }
}

export default new CreateEventController().execute
