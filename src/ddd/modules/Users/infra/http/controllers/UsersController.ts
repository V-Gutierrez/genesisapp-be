import 'dotenv/config'

import { Errors, Success } from '@Helpers/Messages'
import { Request, Response } from 'express'

import Bcrypt from '@Helpers/Bcrypt'
import Formatter from '@Helpers/Formatter'
import SchemaHelper from '@Helpers/SchemaHelper'
import SendgridClient from '@Shared/domain/services/Sendgrid'
import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import UsersRepository from '@Modules/Users/domain/repositories/UsersRepository'

class UsersController {
  static async get(req: Request, res: Response) {
    const { id } = req.params

    try {
      if (!id) res.status(401).json({ message: Errors.INVALID_OR_MISSING_ID })
      else {
        const user = await UsersRepository.getUserById(id)

        if (!user) res.status(404).json({ message: Errors.USER_NOT_FOUND })
        if (user) res.status(200).json(user)
      }
    } catch (error) {
      res.sendStatus(500)
    }
  }

  static async signUp(req: Request, res: Response) {
    try {
      const errors = SchemaHelper.validateSchema(SchemaHelper.SIGNUP_SCHEMA, req.body)

      if (errors) return res.status(400).json({ message: errors })

      const { email, name, password, phone, birthdate, region }: User = req.body

      const user = await UsersRepository.create({
        email: Formatter.sanitizeEmail(email),
        name,
        birthdate: new Date(birthdate).toISOString(),
        password: await Bcrypt.hashPassword(password),
        phone,
        region,
      })

      const token = jwt.sign({ id: user.id }, process.env.ACTIVATION_TOKEN_SECRET as string, {
        expiresIn: '30d',
      })

      const emailSender = new SendgridClient()

      await emailSender.send(
        emailSender.TEMPLATES.confirmationEmail.config(user.email, {
          userFirstName: Formatter.getUserFirstName(user.name),
          activationUrl: `${process.env.FRONT_BASE_URL}/activate?token=${token}`,
        }),
      )

      res.status(201).json({ message: Success.USER_CREATED, user })
    } catch (error) {
      if ((error as any).code === 'P2002')
        res.status(409).json({ message: Errors.USER_ALREADY_EXISTS })
      else res.status(500).json({ message: Errors.INTERNAL_SERVER_ERROR })
    }
  }

  static async getAllUsersAsAdmin(req: Request, res: Response) {
    const { region } = req.cookies.user ?? {}

    try {
      const users = await UsersRepository.getAll(region)

      res.status(200).json(users)
    } catch (error) {
      res.sendStatus(500)
    }
  }
}

export default UsersController
