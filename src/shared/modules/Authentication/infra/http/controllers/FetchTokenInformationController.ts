import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

export class FetchTokenInformationController implements HTTPController {
  async execute(req: Request, res: Response) {
    try {
      const { email, role, id, name, region } = req.cookies.user ?? {}

      if (!req.cookies.user) {
        res.status(204).json({})
      }

      res.status(200).json({ email, role, id, name, region })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new FetchTokenInformationController().execute
