import DevotionalsRepository from '@Modules/Devotionals/domain/repositories/DevotionalsRepository'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

export class GetDevotionalsController implements HTTPController {
  async execute(req: Request, res: Response) {
    const { region } = req.cookies.user ?? {}
    const { page = 1, limit = 5 } = req.query

    try {
      const response = await DevotionalsRepository.getReleased(region, Number(page), Number(limit))

      return res.status(200).json(response.devotionals)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new GetDevotionalsController().execute
