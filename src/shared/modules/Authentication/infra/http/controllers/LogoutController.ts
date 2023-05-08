import CookieHelper from '@Shared/helpers/Cookies'
import { Success } from '@Shared/helpers/Messages'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

export class LogoutController implements HTTPController {
  async execute(_req: Request, res: Response) {
    try {
      res.clearCookie(
        CookieHelper.AuthCookieDefaultOptions.name,
        CookieHelper.AuthCookieDefaultOptions.config,
      )
      res.status(200).json({ message: Success.LOGOUT })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new LogoutController().execute
