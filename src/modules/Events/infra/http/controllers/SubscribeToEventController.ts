import EventsRepository from '@Modules/Events/domain/repositories/EventsRepository'
import { Success } from '@Shared/helpers/Messages'
import SchemaHelper from '@Shared/helpers/SchemaHelper'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

export class SubscribeToEventController implements HTTPController {
  async execute(req: Request, res: Response) {
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

      return res.status(201).json({ message: Success.SUBSCRIPTION_CREATED })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new SubscribeToEventController().execute
