import CookieHelper from '@Shared/helpers/Cookies'
import { HTTPController } from '@Shared/types/interfaces'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import Environment from '@Shared/helpers/Environment'
import UsersRepository from '@Modules/Users/domain/repositories/UsersRepository'
import Bcrypt from '@Shared/helpers/Bcrypt'
import { Errors, Success } from '@Shared/helpers/Messages'
import SchemaHelper from '@Shared/helpers/SchemaHelper'
import Prisma from '@Shared/infra/prisma'
import { User } from '@prisma/client'

export class AuthenticateController implements HTTPController {
  async execute(req: Request, res: Response) {
    try {
      const { [CookieHelper.AuthCookieDefaultOptions.name]: currentToken } = req.cookies

      if (currentToken) {
        jwt.verify(req.cookies.jwt, Environment.getEnv('ACCESS_TOKEN_SECRET'), (error: any) => {
          if (error) {
            /* Clean old token and proceed to auth */
            res.clearCookie(
              CookieHelper.AuthCookieDefaultOptions.name,
              CookieHelper.AuthCookieDefaultOptions.config,
            )
          }
        })
      }

      const errors = SchemaHelper.validateSchema(SchemaHelper.LOGIN_SCHEMA, req.body)
      if (errors) return res.status(400).json({ message: errors })

      const { email, password }: User = req.body

      const user = await UsersRepository.getUserByEmail(email)

      if (!user) {
        return res.status(404).json({ message: Errors.USER_NOT_FOUND })
      }
      if (!user.active) {
        return res.status(403).json({ message: Errors.USER_NOT_ACTIVE })
      }

      const matchPassword = await Bcrypt.comparePassword(password, user.password)

      if (matchPassword) {
        const tokenPayload = {
          email: user.email,
          role: user.role,
          id: user.id,
          name: user.name,
          region: user.region,
        }

        const accessToken = jwt.sign(tokenPayload, Environment.getEnv('ACCESS_TOKEN_SECRET'), {
          expiresIn: '12h',
        })
        const refreshToken = jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET as string, {
          expiresIn: '30d',
        })

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

        return res.status(200).json({ message: Success.LOGIN })
      }
      return res.status(401).json({ message: Errors.NO_AUTH })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new AuthenticateController().execute
