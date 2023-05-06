import StatsRepository from '@Modules/Stats/domain/repositories/StatsRepository'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

export class GetStatsController implements HTTPController {
  async execute(req: Request, res: Response) {
    const { region } = req.cookies.user ?? {}

    try {
      const { devotionals, activeUsers, growthGroups, news, ongoingEvents } =
        await StatsRepository.getStats(region)

      res.status(200).json({
        activeUsers,
        devotionals,
        growthGroups,
        news,
        ongoingEvents,
      })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new GetStatsController().execute
