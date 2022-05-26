import 'dotenv/config'

import { Express, Request, Response } from 'express'

import Bcrypt from '@Helpers/Bcrypt'
import { Decoded } from '@Types/DTO'
import { Errors } from '@Helpers/Messages'
import Joi from 'joi'
import Prisma from '@Clients/Prisma'
import SchemaHelper from '@Helpers/SchemaHelper'
import SendgridClient from '@Services/Sendgrid'
import { User } from '@prisma/client'
import isProduction from '@Helpers/Environment'
import jwt from 'jsonwebtoken'

class Authentication {
  constructor(private readonly app: Express) {
    this.activateNewUser()
    this.resetPassword()
    this.authenticate()
    this.refreshToken()
    this.logout()
    this.setNewPassword()
    this.getUserInformation()
  }

  async authenticate() {
    this.app.post('/api/auth', async (req: Request, res: Response) => {
      try {
        const { jwt: currentToken } = req.cookies

        if (currentToken) {
          jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET as string, (error: any) => {
            if (!error) {
              /* Respond 204 to already authenticated user */
              return res.sendStatus(204)
            }
            /* Clean old token and proceed to auth */
            res.clearCookie('jwt', {
              httpOnly: true,
              secure: isProduction,
              sameSite: isProduction ? 'none' : undefined,
            })
          })
        }

        const errors = SchemaHelper.validateSchema(SchemaHelper.LOGIN_SCHEMA, req.body)
        if (errors) return res.status(400).json({ error: errors })

        const { email, password }: Partial<User> = req.body

        const user = await Prisma.user.findFirst({
          where: {
            email,
          },
          select: {
            name: true,
            password: true,
            email: true,
            id: true,
            role: true,
            active: true,
          },
        })

        if (!user) return res.sendStatus(404)
        if (!user.active) return res.status(403).json({ error: 'User is not activated' })

        const matchPassword = await Bcrypt.comparePassword(password as string, user.password)

        if (matchPassword) {
          const accessToken = jwt.sign(
            { email: user.email, role: user.role, id: user.id, name: user.name },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: '12h' },
          )
          const refreshToken = jwt.sign(
            { email: user.email, role: user.role, id: user.id, name: user.name },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '30d' },
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

          res.setHeader('Access-Control-Allow-Credentials', 'true')

          res.cookie('jwt', accessToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 30 * 1000,
            secure: isProduction,
            sameSite: isProduction ? 'none' : undefined,
          })

          return res.status(200).json({ userLoggedIn: true })
        }
        return res.status(401).json({ error: Errors.NO_AUTH })
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  async refreshToken() {
    this.app.get('/api/auth', async (req: Request, res: Response) => {
      try {
        const { jwt: accessToken } = req.cookies

        // Check Access Token
        jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET as string,
          async (accessTokenError: any, decoded: Decoded) => {
            if (accessTokenError) {
              res.clearCookie('jwt', {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'none' : undefined,
              })
              return res.sendStatus(403)
            }

            const user = await Prisma.user.findFirst({
              where: {
                email: decoded.email,
              },
              select: {
                id: true,
                email: true,
                role: true,
                UserRefreshTokens: true,
              },
            })

            if (!user) {
              res.clearCookie('jwt', {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'none' : undefined,
              })
              return res.sendStatus(403)
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
                  res.clearCookie('jwt', {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: isProduction ? 'none' : undefined,
                  })
                  return res.sendStatus(403)
                }

                const refreshedAccessToken = jwt.sign(
                  { email: user.email, role: user.role },
                  process.env.ACCESS_TOKEN_SECRET as string,
                  { expiresIn: '12h' },
                )

                // If valid - Refresh Access Token with new expiration and send in cookie
                res.cookie('jwt', refreshedAccessToken, {
                  httpOnly: true,
                  maxAge: 60 * 60 * 24 * 30 * 1000,
                  secure: isProduction,
                  sameSite: isProduction ? 'none' : undefined,
                })
                res.status(200).json({ userLoggedIn: true })
              },
            )
          },
        )
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  async activateNewUser() {
    this.app.post('/api/auth/activate', async (req: Request, res: Response) => {
      try {
        const authToken = req.headers.authorization

        if (!authToken) return res.sendStatus(401)

        const { authorization } = req.headers

        jwt.verify(
          authorization as string,
          process.env.ACTIVATION_TOKEN_SECRET as string,
          async (error: any, decoded: Decoded) => {
            if (error) return res.sendStatus(401)

            await Prisma.user.update({
              where: { id: decoded.id },
              data: { active: true },
            })
          },
        )

        res.sendStatus(204)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  async resetPassword() {
    this.app.post('/api/auth/reset-password', async (req: Request, res: Response) => {
      try {
        const errors = SchemaHelper.validateSchema(SchemaHelper.RESET_PASSWORD, req.body)
        if (errors) return res.status(400).json({ error: errors })

        const { email } = req.body

        const user = await Prisma.user.findFirst({
          where: { email },
          select: { email: true, active: true },
        })

        // False 200 status
        if (!user || !user.active)
          return res.status(200).json({ message: 'Reset password email sent' })
        // False 200 status

        const resetToken = jwt.sign({ email }, process.env.PASSWORD_RESET_TOKEN_SECRET as string, {
          expiresIn: '24h',
        })

        if (isProduction) {
          const emailSender = new SendgridClient()

          await emailSender.send(
            emailSender.TEMPLATES.resetPassword.config(email, {
              resetPasswordUrl: `${process.env.FRONT_BASE_URL}/reset-password?token=${resetToken}`,
            }),
          )
        }

        res.status(200).json({ message: 'Reset password email sent' })
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  async setNewPassword() {
    this.app.put('/api/auth/reset-password', async (req: Request, res: Response) => {
      const authToken = req.headers.authorization

      try {
        const errors = SchemaHelper.validateSchema(SchemaHelper.NEW_PASSWORD, req.body)
        if (errors || !authToken) return res.sendStatus(400)

        const { password } = req.body

        jwt.verify(
          authToken,
          process.env.PASSWORD_RESET_TOKEN_SECRET as string,
          async (error: any, decoded: Decoded) => {
            if (error) return res.sendStatus(401)

            await Prisma.user.update({
              where: { email: decoded.email },
              data: {
                password: await Bcrypt.hashPassword(password),
              },
            })
            return res.status(200).json({ message: 'New password successfully set' })
          },
        )
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  async logout() {
    this.app.delete('/api/auth', async (req: Request, res: Response) => {
      try {
        const { jwt: refreshToken } = req.cookies

        const user = await Prisma.user.findFirst({
          where: {
            UserRefreshTokens: { some: { token: refreshToken } },
          },
        })

        if (!user) {
          res.clearCookie('jwt', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : undefined,
          })
          return res.sendStatus(204)
        }
        await Prisma.userRefreshTokens.delete({
          where: { userId: user.id },
        })

        res.clearCookie('jwt', {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? 'none' : undefined,
        })
        return res.sendStatus(204)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  async getUserInformation() {
    this.app.get('/api/auth/me', async (req: Request, res: Response) => {
      const { jwt: accessToken } = req.cookies

      jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET as string,
        (err: any, decoded: Decoded) => {
          if (err) return res.sendStatus(401)

          const { email, role, id, name } = decoded

          return res.status(200).json({ email, role, id, name })
        },
      )
    })
  }
}

export default Authentication
