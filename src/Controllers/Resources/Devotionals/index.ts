import { Express, Request, Response } from 'express'

import CookieHelper from '@Helpers/Cookies'
import { Decoded } from '@Types/DTO'
import { Devotional } from '@prisma/client'
import Prisma from '@Clients/Prisma'
import SchemaHelper from '@Helpers/SchemaHelper'
import jwt from 'jsonwebtoken'

class Devotionals {
  constructor(private readonly app: Express) {
    this.getDevotionals()
  }

  getDevotionals() {
    this.app.get('/api/devotionals', async (_req: Request, res: Response) => {
      try {
        const response: Devotional[] = await Prisma.devotional.findMany()

        res.status(200).json(response)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  createDevotional() {
    this.app.post('/api/devotionals', async (req: Request, res: Response) => {
      try {
        const { [CookieHelper.AuthCookieDefaultOptions.name]: token } = req.cookies

        const errors = SchemaHelper.validateSchema(SchemaHelper.DEVOTIONAL_CREATION, req.body)

        if (errors) {
          return res.status(400).json({ error: errors })
        }

        const { body, title } = req.body

        jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET as string,
          async (err: any, decoded: Decoded) => {
            if (err) return res.sendStatus(403)
            if (decoded.role !== 'ADMIN') return res.sendStatus(401)

            const devotional = await Prisma.devotional.create({
              data: {
                body,
                title,
                userId: decoded.id,
              },
            })

            return res.status(201).json(devotional)
          },
        )
      } catch (e) {
        res.sendStatus(500)
      }
    })
  }
}

export default Devotionals
