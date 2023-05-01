import EventsRepository from '@Modules/Events/domain/repositories/EventsRepository'
import { Request, Response } from 'express'

export class GetEventByIdController {
  async execute(req: Request, res: Response) {
    const { region } = req.cookies.user ?? {}

    try {
      const { id } = req.params
      const response = await EventsRepository.getEventById(id, region)

      res.status(200).json(response)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new GetEventByIdController().execute
