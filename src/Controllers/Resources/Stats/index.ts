import { Express, Request, Response } from 'express'

import StatsModel from '@Models/Stats'

class Stats {
  static getStats(app: Express) {
    app.get('/api/stats', async (req: Request, res: Response) => {
      const { region } = req.cookies.user ?? {}

      try {
        const { devotionals, activeUsers, growthGroups, news, ongoingEvents } =
          await StatsModel.getStats(region)

        return res.status(200).json({
          activeUsers,
          devotionals,
          growthGroups,
          news,
          ongoingEvents,
        })
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}

export default Stats
