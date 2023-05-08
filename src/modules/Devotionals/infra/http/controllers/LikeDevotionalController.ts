import DevotionalsRepository from '@Modules/Devotionals/domain/repositories/DevotionalsRepository'
import { Success } from '@Shared/helpers/Messages'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

export class LikeDevotionalController implements HTTPController {
  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { id: userId } = req.cookies.user ?? {}

      await DevotionalsRepository.like(id, userId)

      return res.status(201).json({ status: Success.RESOURCE_CREATED })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new LikeDevotionalController().execute
