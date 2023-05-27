import GalleriesRepository from '@Modules/Galleries/domain/repositories/GalleriesRepository'
import { Success } from '@Shared/helpers/Messages'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

export class LikeGalleryController implements HTTPController {
  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { id: userId } = req.cookies.user ?? {}

      await GalleriesRepository.like(id, userId)

      return res.status(201).json({ message: Success.RESOURCE_CREATED })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new LikeGalleryController().execute
