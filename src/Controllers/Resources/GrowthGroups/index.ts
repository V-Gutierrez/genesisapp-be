import { Express, Request, Response } from 'express'

import { GrowthGroup } from '@prisma/client'
import { GrowthGroupsModel } from '@Models/GrowthGroups'

class GrowthGroups {
  static async getGrowthGroups(app: Express) {
    app.get('/api/growthgroups', async (_req: Request, res: Response) => {
      try {
        const response: GrowthGroup[] = await GrowthGroupsModel.getAll()

        res.status(200).json(response)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}

export default GrowthGroups
