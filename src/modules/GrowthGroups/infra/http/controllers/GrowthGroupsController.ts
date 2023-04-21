import GrowthGroupsRepository from 'src/modules/GrowthGroups/domain/repositories/GrowthGroupsRepository'
import { Request, Response } from 'express'

class GrowthGroupsController {
  static async getGrowthGroups(req: Request, res: Response) {
    const { region } = req.cookies.user ?? {}

    try {
      const response = await GrowthGroupsRepository.getAll(region)

      res.status(200).json(response)
    } catch (error) {
      res.sendStatus(500)
    }
  }
}

export default GrowthGroupsController
