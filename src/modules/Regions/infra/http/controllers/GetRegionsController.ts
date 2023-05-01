import RegionsRepository from '@Modules/Regions/domain/repositories/RegionsRepository'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

class GetRegionsController implements HTTPController {
  async execute(_req: Request, res: Response) {
    try {
      const regions = await RegionsRepository.getAll()

      res.status(200).json(regions)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new GetRegionsController().execute
