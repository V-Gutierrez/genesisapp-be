import { Express, Request, Response } from 'express'

import StatsModel from '@Models/Stats'

class Stats {
  static getStats(app: Express) {
    app.get('/api/stats', async (_req: Request, res: Response) => {
      try {
        const { devotionals, activeUsers, growthGroups } = await StatsModel.getStats()

        return res.status(200).json({
          activeUsers,
          devotionals,
          growthGroups,
        })
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}

export default Stats
