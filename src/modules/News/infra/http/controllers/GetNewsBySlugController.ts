import NewsRepository from '@Modules/News/domain/repositories/NewsRepository'
import { Errors } from '@Shared/helpers/Messages'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

export class GetNewsBySlugController implements HTTPController {
  async execute(req: Request, res: Response) {
    try {
      const { slug } = req.params
      const { id: userId, region } = req.cookies.user ?? {}

      const response = await NewsRepository.getBySlug(slug, region)

      if (!response) {
        res.status(404).json({ message: Errors.RESOURCE_NOT_FOUND })
        return
      }

      await NewsRepository.view(response.id, userId)
      res.status(200).json(response)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new GetNewsBySlugController().execute
