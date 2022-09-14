import RegionModel from '@Models/RegionModel'
import { Express, Request, Response } from 'express'

class Regions {
  static getRegions(app: Express) {
    app.get('/api/regions', async (_req: Request, res: Response) => {
      try {
        const regions = await RegionModel.fetchAll()

        res.status(200).json(regions)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}

export default Regions
