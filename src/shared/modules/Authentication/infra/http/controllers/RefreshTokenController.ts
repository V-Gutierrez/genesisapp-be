import UsersRepository from '@Modules/Users/domain/repositories/UsersRepository'
import CookieHelper from '@Shared/helpers/Cookies'
import Environment from '@Shared/helpers/Environment'
import { Errors, Success } from '@Shared/helpers/Messages'
import Prisma from '@Shared/infra/prisma'
import { Decoded } from '@Shared/types/dtos'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export class RefreshTokenController implements HTTPController {
  async execute(req: Request, res: Response) {
    try {
      const { [CookieHelper.AuthCookieDefaultOptions.name]: accessToken } = req.cookies

      // Check Access Token
      jwt.verify(
        accessToken,
        Environment.getEnv('ACCESS_TOKEN_SECRET'),
        async (accessTokenError: any, decoded: Decoded) => {
          if (accessTokenError) {
            res.clearCookie(
              CookieHelper.AuthCookieDefaultOptions.name,
              CookieHelper.AuthCookieDefaultOptions.config,
            )
            return res.status(403).json({ message: Errors.NO_AUTH })
          }

          const user = await UsersRepository.getUserByDecodedEmail(decoded.email)

          if (!user) {
            res.clearCookie('jwt', {
              httpOnly: true,
              secure: Environment.isProduction,
              sameSite: Environment.isProduction ? 'none' : undefined,
            })
            return res.status(403).json({ message: Errors.NO_AUTH })
          }

          const { UserRefreshTokens, id: userId } = user
          const [{ token: refreshAccessToken }] = UserRefreshTokens

          // Check if refresh token is still valid
          jwt.verify(
            refreshAccessToken,
            process.env.REFRESH_TOKEN_SECRET as string,
            async (refreshTokenError: any) => {
              if (refreshTokenError) {
                await Prisma.userRefreshTokens.delete({
                  where: {
                    userId,
                  },
                })

                res.clearCookie(
                  CookieHelper.AuthCookieDefaultOptions.name,
                  CookieHelper.AuthCookieDefaultOptions.config,
                )

                return res.status(403).json({ message: Errors.NO_AUTH })
              }

              const refreshedAccessToken = jwt.sign(
                {
                  email: user.email,
                  role: user.role,
                  id: user.id,
                  region: user.region,
                },
                Environment.getEnv('ACCESS_TOKEN_SECRET'),
                { expiresIn: '12h' },
              )

              // If valid - Refresh Access Token with new expiration and send in cookie
              res.cookie(
                CookieHelper.AuthCookieDefaultOptions.name,
                refreshedAccessToken,
                CookieHelper.AuthCookieDefaultOptions.config,
              )
              return res.status(200).json({ message: Success.LOGIN })
            },
          )
        },
      )
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new RefreshTokenController().execute
