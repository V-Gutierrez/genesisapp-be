import { Express, Request, Response } from 'express'

import GrowthGroupsModel from '@Models/GrowthGroups'

class GrowthGroups {
  static async getGrowthGroups(app: Express) {
    app.get('/api/growthgroups', async (req: Request, res: Response) => {
      const { region } = req.cookies.user ?? {}

      try {
        const response = await GrowthGroupsModel.getAll(region)

        res.status(200).json(response)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}

export default GrowthGroups
