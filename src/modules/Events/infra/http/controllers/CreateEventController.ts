import EventsRepository from '@Modules/Events/domain/repositories/EventsRepository'
import { TIMEZONE } from '@Shared/constants'
import Environment from '@Shared/helpers/Environment'
import Formatter from '@Shared/helpers/Formatter'
import { Errors } from '@Shared/helpers/Messages'
import SchemaHelper from '@Shared/helpers/SchemaHelper'
import ImageKit from '@Shared/services/ImageKit'
import OneSignal from '@Shared/services/OneSignal'
import { ImageKitFolders } from '@Shared/types/Enum'
import { HTTPController } from '@Shared/types/interfaces'
import { subHours } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { Request, Response } from 'express'

export class CreateEventController implements HTTPController {
  async execute(req: Request, res: Response) {
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

      await OneSignal.send(
        'Inscrições abertas',
        `Inscreva-se para ${title} no app da Gênesis Church`,
        `${Environment.getEnv('FRONT_BASE_URL')}/eventos/inscricoes/${newEvent?.id}`,
        zonedTimeToUtc(new Date(subscriptionsScheduledTo), TIMEZONE),
        newEvent?.region,
      )

      return res.status(201).json(newEvent)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: Errors.INTERNAL_SERVER_ERROR })
    }
  }
}

export default new CreateEventController().execute
