import { Express, Request, Response } from 'express'

import Middlewares from '@Controllers/Middlewares'
import Prisma from '@Clients/Prisma'
import { zonedTimeToUtc } from 'date-fns-tz'

class Stats {
  static getStats(app: Express) {
    app.get('/api/stats', async (_req: Request, res: Response) => {
      try {
        const activeUsers = await Prisma.user.count({
          where: {
            active: true,
          },
        })

        const devotionals = await Prisma.devotional.count()
        const groups = await Prisma.growthGroup.count()

        return res.status(200).json({
          activeUsers,
          devotionals,
          groups,
        })
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}

export default Stats
