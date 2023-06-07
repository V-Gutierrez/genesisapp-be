import NewsRepository from '@Modules/News/domain/repositories/NewsRepository'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

export class GetNewsController implements HTTPController {
  async execute(req: Request, res: Response) {
    const { region } = req.cookies.user ?? {}
    const { page = 1, limit = 5, isHighlight = false } = req.query

    try {
      const response = await NewsRepository.getReleasedNews(region, Number(page), Number(limit))

      return res.status(200).json(response.news)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new GetNewsController().execute
