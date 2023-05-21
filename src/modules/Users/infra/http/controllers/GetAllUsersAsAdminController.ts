import UsersRepository from '@Modules/Users/domain/repositories/UsersRepository'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

class GetAllUsersAsAdminController implements HTTPController {
  async execute(req: Request, res: Response) {
    const { region } = req.cookies.user ?? {}
    const { page = 1, limit = 5 } = req.query

    try {
      const users = await UsersRepository.getAll(region, Number(page), Number(limit))

      return res.status(200).json(users)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new GetAllUsersAsAdminController().execute
