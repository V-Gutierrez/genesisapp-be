import GrowthGroupsRepository from '@Modules/GrowthGroups/domain/repositories/GrowthGroupsRepository'
import { Success } from '@Shared/helpers/Messages'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

class DeleteGrowthGroupController implements HTTPController {
  async execute(req: Request, res: Response) {
    try {
      const { id } = req.params

      await GrowthGroupsRepository.deleteById(id)

      return res.status(200).json({ message: Success.RESOURCE_DELETED })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new DeleteGrowthGroupController().execute
