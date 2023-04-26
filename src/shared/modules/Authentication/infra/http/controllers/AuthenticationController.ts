import { Request, Response } from 'express'

import SendgridClient from '@Shared/services/Sendgrid'
import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import UsersRepository from 'src/modules/Users/domain/repositories/UsersRepository'
import Bcrypt from 'src/shared/helpers/Bcrypt'
import CookieHelper from 'src/shared/helpers/Cookies'
import { Errors, Success } from 'src/shared/helpers/Messages'
import SchemaHelper from 'src/shared/helpers/SchemaHelper'
import Prisma from 'src/shared/infra/prisma'
import { Decoded } from '@Shared/types/dtos'
import Environment from '@Shared/helpers/Environment'

class AuthenticationController {
  static async authenticate(req: Request, res: Response) {
    try {
      const { [CookieHelper.AuthCookieDefaultOptions.name]: currentToken } =
        req.cookies

      if (currentToken) {
        jwt.verify(
          req.cookies.jwt,
          Environment.getStringEnv('ACCESS_TOKEN_SECRET'),
          (error: any) => {
            if (error) {
              /* Clean old token and proceed to auth */
              res.clearCookie(
                CookieHelper.AuthCookieDefaultOptions.name,
                CookieHelper.AuthCookieDefaultOptions.config,
              )
            }
          },
        )
      }

      const errors = SchemaHelper.validateSchema(
        SchemaHelper.LOGIN_SCHEMA,
        req.body,
      )
      if (errors) return res.status(400).json({ message: errors })

      const { email, password }: User = req.body

      const user = await UsersRepository.getUserByEmail(email)

      if (!user) return res.status(404).json({ message: Errors.USER_NOT_FOUND })
      if (!user.active)
        return res.status(403).json({ message: Errors.USER_NOT_ACTIVE })

      const matchPassword = await Bcrypt.comparePassword(
        password,
        user.password,
      )

      if (matchPassword) {
        const tokenPayload = {
          email: user.email,
          role: user.role,
          id: user.id,
          name: user.name,
          region: user.region,
        }

        const accessToken = jwt.sign(
          tokenPayload,
          Environment.getStringEnv('ACCESS_TOKEN_SECRET'),
          {
            expiresIn: '12h',
          },
        )
        const refreshToken = jwt.sign(
          tokenPayload,
          process.env.REFRESH_TOKEN_SECRET as string,
          {
            expiresIn: '30d',
          },
        )

        await Prisma.userRefreshTokens.upsert({
          where: {
            userId: user.id,
          },
          update: {
            token: refreshToken,
          },
          create: {
            userId: user.id,
            token: refreshToken,
          },
        })

        res.cookie(
          CookieHelper.AuthCookieDefaultOptions.name,
          accessToken,
          CookieHelper.AuthCookieDefaultOptions.config,
        )

        return res.status(200).json({ userLoggedIn: true })
      }
      return res.status(401).json({ message: Errors.NO_AUTH })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { [CookieHelper.AuthCookieDefaultOptions.name]: accessToken } =
        req.cookies

      // Check Access Token
      jwt.verify(
        accessToken,
        Environment.getStringEnv('ACCESS_TOKEN_SECRET'),
        async (accessTokenError: any, decoded: Decoded) => {
          if (accessTokenError) {
            res.clearCookie(
              CookieHelper.AuthCookieDefaultOptions.name,
              CookieHelper.AuthCookieDefaultOptions.config,
            )
            return res.status(403).json({ message: Errors.NO_AUTH })
          }

          const user = await UsersRepository.getUserByDecodedEmail(
            decoded.email,
          )

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
                Environment.getStringEnv('ACCESS_TOKEN_SECRET'),
                { expiresIn: '12h' },
              )

              // If valid - Refresh Access Token with new expiration and send in cookie
              res.cookie(
                CookieHelper.AuthCookieDefaultOptions.name,
                refreshedAccessToken,
                CookieHelper.AuthCookieDefaultOptions.config,
              )
              res.status(200).json({ message: Success.LOGIN })
            },
          )
        },
      )
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }

  static async activateNewUser(req: Request, res: Response) {
    try {
      const authToken = req.headers.authorization

      if (!authToken) return res.status(401).json({ message: Errors.NO_AUTH })

      const { authorization } = req.headers

      jwt.verify(
        authorization as string,
        process.env.ACTIVATION_TOKEN_SECRET as string,
        async (error: any, decoded: Decoded) => {
          if (error) return res.status(401).json({ message: Errors.NO_AUTH })

          await UsersRepository.activateUserById(decoded.id)

          return res.status(200).json({ message: Success.USER_ACTIVATED })
        },
      )
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const errors = SchemaHelper.validateSchema(
        SchemaHelper.RESET_PASSWORD,
        req.body,
      )
      if (errors) return res.status(400).json({ message: errors })

      const { email } = req.body

      const user = await UsersRepository.getUserByEmail(email)

      // False 200 status
      if (!user || !user.active)
        return res.status(200).json({ message: Success.RESET_EMAIL_SEND })
      // False 200 status

      const resetToken = jwt.sign(
        { email },
        process.env.PASSWORD_RESET_TOKEN_SECRET as string,
        {
          expiresIn: '24h',
        },
      )

      if (Environment.isProduction) {
        const emailSender = new SendgridClient()

        await emailSender.send(
          emailSender.TEMPLATES.resetPassword.config(email, {
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

  static async setNewPassword(req: Request, res: Response) {
    const authToken = req.headers.authorization

    try {
      const errors = SchemaHelper.validateSchema(
        SchemaHelper.NEW_PASSWORD,
        req.body,
      )
      if (errors || !authToken)
        return res.status(400).json({ message: Errors.NO_AUTH, error: errors })

      const { password } = req.body

      jwt.verify(
        authToken,
        process.env.PASSWORD_RESET_TOKEN_SECRET as string,
        async (error: any, decoded: Decoded) => {
          if (error) return res.status(401).json({ message: Errors.NO_AUTH })

          await UsersRepository.setUserPasswordByEmail(decoded.email, password)

          return res.status(200).json({ message: Success.NEW_PASSWORD_SET })
        },
      )
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }

  static async logout(_req: Request, res: Response) {
    try {
      res.clearCookie(
        CookieHelper.AuthCookieDefaultOptions.name,
        CookieHelper.AuthCookieDefaultOptions.config,
      )
      return res.status(200).json({ message: Success.LOGOUT })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }

  static async getUserInformation(req: Request, res: Response) {
    try {
      const { email, role, id, name, region } = req.cookies.user ?? {}

      return res.status(200).json({ email, role, id, name, region })
    } catch (error) {
      console.error(error)
      return res.sendStatus(500)
    }
  }
}

export default AuthenticationController
