import UsersRepository from '@Modules/Users/domain/repositories/UsersRepository'
import { Errors } from '@Shared/helpers/Messages'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

export class GetUsersController implements HTTPController {
  async execute(req: Request, res: Response) {
    const { id } = req.params

    try {
      if (!id) return res.status(401).json({ message: Errors.INVALID_OR_MISSING_ID })
      
        const user = await UsersRepository.getUserById(id)

        if (!user) return res.status(404).json({ message: Errors.USER_NOT_FOUND })
        if (user) return res.status(200).json(user)
      
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new GetUsersController().execute
