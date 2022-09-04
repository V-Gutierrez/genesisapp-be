import { Express, Request, Response } from 'express'

import GrowthGroupsModel from '@Models/GrowthGroups'

class GrowthGroups {
  static async getGrowthGroups(app: Express) {
    app.get('/api/growthgroups', async (_req: Request, res: Response) => {
      try {
        const response = await GrowthGroupsModel.getAll()

        res.status(200).json(response)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}

export default GrowthGroups
