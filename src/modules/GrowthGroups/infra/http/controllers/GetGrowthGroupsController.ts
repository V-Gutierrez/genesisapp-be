import GrowthGroupsRepository from '@Modules/GrowthGroups/domain/repositories/GrowthGroupsRepository'
import { Request, Response } from 'express'

export class GetGrowthGroupsController {
  async execute(req: Request, res: Response) {
    const { region } = req.cookies.user ?? {}

    try {
      const response = await GrowthGroupsRepository.getAll(region)

      res.status(200).json(response)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new GetGrowthGroupsController().execute
