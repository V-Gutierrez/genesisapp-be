import GalleriesRepository from '@Modules/Galleries/domain/repositories/GalleriesRepository'
import { Errors } from '@Shared/helpers/Messages'
import { HTTPController } from '@Shared/types/interfaces'
import { Region } from '@prisma/client'
import { Request, Response } from 'express'

export class GetGalleriesController implements HTTPController {
  async execute(req: Request, res: Response): Promise<any> {
    try {
      const { region } = req.cookies.user ?? {}
      const { page = 1, limit = 10 } = req.query

      const response = await GalleriesRepository.getAll(
        region as Region,
        Number(page),
        Number(limit),
      )

      return res.json(response.galleries)
    } catch (error) {
      return res.status(500).json({ error: Errors.INTERNAL_SERVER_ERROR })
    }
  }
}

export default new GetGalleriesController().execute
