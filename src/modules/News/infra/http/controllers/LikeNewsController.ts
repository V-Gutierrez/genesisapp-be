import NewsRepository from '@Modules/News/domain/repositories/NewsRepository'
import { Success } from '@Shared/helpers/Messages'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

export class LikeNewsController implements HTTPController {
  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { id: userId } = req.cookies.user ?? {}

      await NewsRepository.like(id, userId)

      res.status(201).json({ message: Success.RESOURCE_CREATED })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new LikeNewsController().execute
