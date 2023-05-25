import GalleriesRepository from '@Modules/Galleries/domain/repositories/GalleriesRepository'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

export class GetGalleryByIdController implements HTTPController {
  async execute(req: Request, res: Response): Promise<any> {
    const { region } = req.cookies.user ?? {}

    try {
      const { id } = req.params

      const response = await GalleriesRepository.getById(id, region)

      return res.status(200).json(response)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new GetGalleryByIdController().execute
