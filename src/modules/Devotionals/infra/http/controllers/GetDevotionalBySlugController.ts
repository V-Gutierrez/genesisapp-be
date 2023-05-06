import DevotionalsRepository from '@Modules/Devotionals/domain/repositories/DevotionalsRepository'
import { Errors } from '@Shared/helpers/Messages'
import { HTTPController } from '@Shared/types/interfaces'
import type { Request, Response } from 'express'

export class GetDevotionalBySlugController implements HTTPController {
  async execute(req: Request, res: Response) {
    try {
      const { slug } = req.params
      const { id: userId, region } = req.cookies.user ?? {}

      const response = await DevotionalsRepository.getBySlug(slug, region)

      if (!response) {
        res.status(404).json({ message: Errors.RESOURCE_NOT_FOUND })
        return
      }

      await DevotionalsRepository.view(response.id, userId)
      res.status(200).json(response)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new GetDevotionalBySlugController().execute
