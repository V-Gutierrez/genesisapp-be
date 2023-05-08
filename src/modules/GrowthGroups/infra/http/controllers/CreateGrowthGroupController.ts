import GrowthGroupsRepository from '@Modules/GrowthGroups/domain/repositories/GrowthGroupsRepository'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'
import SchemaHelper from '@Shared/helpers/SchemaHelper'
import GoogleMaps from '@Shared/services/GoogleMaps'
import RegionsRepository from '@Modules/Regions/domain/repositories/RegionsRepository'
import { Errors } from '@Shared/helpers/Messages'

export class CreateGrowthGroupsController implements HTTPController {
  async execute(req: Request, res: Response) {
    try {
      const errors = SchemaHelper.validateSchema(SchemaHelper.GROWTH_GROUP_CREATION, req.body)

      if (errors) {
        return res.status(400).json({ message: errors })
      }

      const { region } = req.cookies.user ?? {}

      const regionName = RegionsRepository.getRegionName(region as string)

      const address = `${req.body.addressInfo}, ${regionName}`
      const addressResponse = await GoogleMaps.getGeocodeFromAddress(address)

      if (!addressResponse) {
        return res.status(400).json({
          message: Errors.INVALID_ADDRESS,
        })
      }

      const response = await GrowthGroupsRepository.create({
        ...req.body,
        region,
        lat: addressResponse.lat,
        lng: addressResponse.lng,
      })

      return res.status(201).json(response)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new CreateGrowthGroupsController().execute
