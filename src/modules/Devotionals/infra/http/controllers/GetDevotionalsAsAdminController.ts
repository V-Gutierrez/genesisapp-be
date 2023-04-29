import DevotionalsRepository from '@Modules/Devotionals/domain/repositories/DevotionalsRepository'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

export class GetDevotionalsAsAdminController implements HTTPController {
  async execute(req: Request, res: Response) {
    const { region } = req.cookies.user ?? {}

    try {
      const response = await DevotionalsRepository.getAll(region)

      res.status(200).json(response)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new GetDevotionalsAsAdminController().execute
