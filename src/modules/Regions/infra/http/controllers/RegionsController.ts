import RegionsRepository from 'src/modules/Regions/domain/repositories/RegionsRepository'
import { Request, Response } from 'express'

class RegionsController {
  static async getRegions(_req: Request, res: Response) {
    try {
      const regions = await RegionsRepository.fetchAll()

      res.status(200).json(regions)
    } catch (error) {
      res.sendStatus(500)
    }
  }
}

export default RegionsController
