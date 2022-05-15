import { Express, Request, Response } from 'express'

import { GrowthGroup } from '@prisma/client'
import Prisma from '@Clients/Prisma'
import ResponseHandler from 'src/Helpers/ResponseHandler'

class GrowthGroupsRoutes {
  constructor(private readonly app: Express) {
    this.getGrowthGroups()
  }

  private async getGrowthGroups() {
    this.app.get('/api/growthgroups', async (_req: Request, res: Response) => {
      try {
        const response: GrowthGroup[] = await Prisma.growthGroup.findMany()

        new ResponseHandler(res, 200, response)
      } catch (error) {
        new ResponseHandler(res, 500, null)
      }
    })
  }
}

export default GrowthGroupsRoutes
