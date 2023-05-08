import EventsRepository from '@Modules/Events/domain/repositories/EventsRepository'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

export class GetEventsAsAdminController implements HTTPController {
  async execute(req: Request, res: Response) {
    try {
      const response = await EventsRepository.getAll()

      return res.status(200).json(response)
    } catch (error) {
      console.error(error)

      res.sendStatus(500)
    }
  }
}

export default new GetEventsAsAdminController().execute
