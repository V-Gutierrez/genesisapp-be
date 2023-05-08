import EventsRepository from '@Modules/Events/domain/repositories/EventsRepository'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

export class GetEventsController implements HTTPController {
  async execute(req: Request, res: Response) {
    const { region } = req.cookies.user ?? {}

    try {
      const response = await EventsRepository.getReleasedEvents(region)

      return res.status(200).json(response)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new GetEventsController().execute
