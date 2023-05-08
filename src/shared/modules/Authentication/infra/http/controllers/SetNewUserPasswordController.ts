import UsersRepository from '@Modules/Users/domain/repositories/UsersRepository'
import { Errors, Success } from '@Shared/helpers/Messages'
import SchemaHelper from '@Shared/helpers/SchemaHelper'
import { Decoded } from '@Shared/types/dtos'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export class SetNewUserPasswordController implements HTTPController {
  async execute(req: Request, res: Response) {
    const authToken = req.headers.authorization

    try {
      const errors = SchemaHelper.validateSchema(SchemaHelper.NEW_PASSWORD, req.body)
      if (errors || !authToken) {
        res.status(400).json({ message: Errors.NO_AUTH, error: errors })
        return
      }

      const { password } = req.body

      jwt.verify(
        authToken,
        process.env.PASSWORD_RESET_TOKEN_SECRET as string,
        async (error: any, decoded: Decoded) => {
          if (error) res.status(401).json({ message: Errors.NO_AUTH })

          await UsersRepository.setUserPasswordByEmail(decoded.email, password)

          res.status(200).json({ message: Success.NEW_PASSWORD_SET })
        },
      )
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new SetNewUserPasswordController().execute
