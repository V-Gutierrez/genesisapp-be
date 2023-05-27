import GalleriesRepository from '@Modules/Galleries/domain/repositories/GalleriesRepository'
import { Errors } from '@Shared/helpers/Messages'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

export class GetGalleryByIdController implements HTTPController {
  async execute(req: Request, res: Response): Promise<any> {
    const { region, id: userId } = req.cookies.user ?? {}

    try {
      const { id } = req.params

      const response = await GalleriesRepository.getById(id, region)

      if (!response) {
        return res.status(404).json({ message: Errors.RESOURCE_NOT_FOUND })
      }

      await GalleriesRepository.view(response.id, userId)

      return res.status(200).json(response)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new GetGalleryByIdController().execute
