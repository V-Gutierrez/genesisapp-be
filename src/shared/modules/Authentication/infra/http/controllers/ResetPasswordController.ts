import UsersRepository from '@Modules/Users/domain/repositories/UsersRepository'
import Environment from '@Shared/helpers/Environment'
import { Success } from '@Shared/helpers/Messages'
import SchemaHelper from '@Shared/helpers/SchemaHelper'
import Sendgrid from '@Shared/services/Sendgrid'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export class ResetPasswordController implements HTTPController {
  async execute(req: Request, res: Response) {
    try {
      const errors = SchemaHelper.validateSchema(SchemaHelper.RESET_PASSWORD, req.body)
      if (errors) return res.status(400).json({ message: errors })

      const { email } = req.body

      const user = await UsersRepository.getUserByEmail(email)

      // False 200 status
      if (!user || !user.active) return res.status(200).json({ message: Success.RESET_EMAIL_SEND })
      // False 200 status

      const resetToken = jwt.sign({ email }, process.env.PASSWORD_RESET_TOKEN_SECRET as string, {
        expiresIn: '24h',
      })

      if (Environment.isProduction) {
        await Sendgrid.send(
          Sendgrid.TEMPLATES.resetPassword.config(email, {
            resetPasswordUrl: `${process.env.FRONT_BASE_URL}/reset-password?token=${resetToken}`,
          }),
        )
      }

      return res.status(200).json({ message: Success.RESET_EMAIL_SEND })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new ResetPasswordController().execute
