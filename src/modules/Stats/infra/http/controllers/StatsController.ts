import StatsRepository from 'src/modules/Stats/domain/repositories/StatsRepository'
import { Request, Response } from 'express'

class StatsController {
  static async getStats(req: Request, res: Response) {
    const { region } = req.cookies.user ?? {}

    try {
      const { devotionals, activeUsers, growthGroups, news, ongoingEvents } =
        await StatsRepository.getStats(region)

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
  }
}

export default StatsController
