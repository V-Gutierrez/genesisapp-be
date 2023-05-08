import NewsRepository from '@Modules/News/domain/repositories/NewsRepository'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

class GetNewsAsAdminController implements HTTPController {
  async execute(req: Request, res: Response) {
    const { region } = req.cookies.user ?? {}

    try {
      const response = await NewsRepository.getAll(region)

      return res.status(200).json(response)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new GetNewsAsAdminController().execute
