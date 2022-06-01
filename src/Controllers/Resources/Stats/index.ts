import { Express, Request, Response } from 'express'

import Middlewares from '@Controllers/Middlewares'
import Prisma from '@Clients/Prisma'
import { zonedTimeToUtc } from 'date-fns-tz'

class Stats {
  constructor(private readonly app: Express) {
    Middlewares.IsAdmin(this.app)
    this.getStats()
  }

  getStats() {
    this.app.get('/api/stats', async (req: Request, res: Response) => {
      try {
        const activeUsers = await Prisma.user.count({
          where: {
            active: true,
          },
        })

        const devotionals = await Prisma.devotional.count({
          where: {
            scheduledTo: {
              gte: zonedTimeToUtc(new Date(Date.now()), 'America/Sao_Paulo'),
            },
          },
        })
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
