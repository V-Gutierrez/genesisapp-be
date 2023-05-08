import UsersRepository from '@Modules/Users/domain/repositories/UsersRepository'
import { Errors, Success } from '@Shared/helpers/Messages'
import { Decoded } from '@Shared/types/dtos'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export class ActivateUserController implements HTTPController {
  async execute(req: Request, res: Response) {
    try {
      const authToken = req.headers.authorization

      if (!authToken) res.status(401).json({ message: Errors.NO_AUTH })

      const { authorization } = req.headers

      jwt.verify(
        authorization as string,
        process.env.ACTIVATION_TOKEN_SECRET as string,
        async (error: any, decoded: Decoded) => {
          if (error) res.status(401).json({ message: Errors.NO_AUTH })

          await UsersRepository.activateUserById(decoded.id)

          res.status(200).json({ message: Success.USER_ACTIVATED })
        },
      )
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new ActivateUserController().execute
