import UsersRepository from '@Modules/Users/domain/repositories/UsersRepository'
import { User } from '@prisma/client'
import Bcrypt from '@Shared/helpers/Bcrypt'
import Environment from '@Shared/helpers/Environment'
import Formatter from '@Shared/helpers/Formatter'
import { Success, Errors } from '@Shared/helpers/Messages'
import SchemaHelper from '@Shared/helpers/SchemaHelper'
import SendgridClient from '@Shared/services/Sendgrid'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export class UserSignUpController implements HTTPController {
  async execute(req: Request, res: Response) {
    try {
      const errors = SchemaHelper.validateSchema(SchemaHelper.SIGNUP_SCHEMA, req.body)

      if (errors) res.status(400).json({ message: errors })

      const { email, name, password, phone, birthdate, region }: User = req.body

      const user = await UsersRepository.create({
        email: Formatter.sanitizeEmail(email),
        name,
        birthdate: new Date(birthdate).toISOString(),
        password: await Bcrypt.hashPassword(password),
        phone,
        region,
      })

      const token = jwt.sign({ id: user.id }, Environment.getEnv('ACTIVATION_TOKEN_SECRET'), {
        expiresIn: '30d',
      })

      await SendgridClient.send(
        SendgridClient.TEMPLATES.confirmationEmail.config(user.email, {
          userFirstName: Formatter.getUserFirstName(user.name),
          activationUrl: `${Environment.getEnv('FRONT_BASE_URL')}/activate?token=${token}`,
        }),
      )

      res.status(201).json({ message: Success.USER_CREATED, user })
    } catch (error) {
      console.error(error)
      if ((error as any).code === 'P2002')
        res.status(409).json({ message: Errors.USER_ALREADY_EXISTS })
      else res.status(500).json({ message: Errors.INTERNAL_SERVER_ERROR })
    }
  }
}

export default new UserSignUpController().execute
