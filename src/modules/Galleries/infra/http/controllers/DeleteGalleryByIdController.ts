import GalleriesRepository from '@Modules/Galleries/domain/repositories/GalleriesRepository'
import { Errors, Success } from '@Shared/helpers/Messages'
import ImageKit from '@Shared/services/ImageKit'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

class DeleteGalleryByIdController implements HTTPController {
  async execute(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params

      const deleted = await GalleriesRepository.deleteById(id)

      await ImageKit.delete(deleted.assetId)

      return res.status(200).json({ message: Success.RESOURCE_DELETED })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: Errors.INTERNAL_SERVER_ERROR })
    }
  }
}
