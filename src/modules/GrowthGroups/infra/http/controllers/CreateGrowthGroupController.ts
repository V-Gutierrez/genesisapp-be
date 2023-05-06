import GrowthGroupsRepository from '@Modules/GrowthGroups/domain/repositories/GrowthGroupsRepository'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'
import SchemaHelper from '@Shared/helpers/SchemaHelper'

export class CreateGrowthGroupsController implements HTTPController {
  async execute(req: Request, res: Response) {
    try {
      const errors = SchemaHelper.validateSchema(SchemaHelper.GROWTH_GROUP_CREATION, req.body)

      if (errors) {
        res.status(400).json({ message: errors })
      }

      const response = await GrowthGroupsRepository.create(req.body)

      res.status(200).json(response)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new CreateGrowthGroupsController().execute
