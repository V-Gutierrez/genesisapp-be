import EventsRepository from '@Modules/Events/domain/repositories/EventsRepository'
import { Success } from '@Shared/helpers/Messages'
import { Request, Response } from 'express'

export class DeleteEventSubscriptionController {
  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params
      await EventsRepository.removeSubscriptionById(id)

      res.status(200).json({ message: Success.RESOURCE_DELETED })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new DeleteEventSubscriptionController().execute
