import EventsRepository from '@Modules/Events/domain/repositories/EventsRepository'
import { Success } from '@Shared/helpers/Messages'
import ImageKit from '@Shared/services/ImageKit'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

export class DeleteEventController implements HTTPController {
  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params

      const deleted = await EventsRepository.deleteById(id)

      await ImageKit.delete(deleted.assetId)

      res.status(200).json({ message: Success.RESOURCE_DELETED })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new DeleteEventController().execute
