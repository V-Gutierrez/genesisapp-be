import { Express, Request, Response } from 'express'

import CookieHelper from '@Helpers/Cookies'
import { Decoded } from '@Types/DTO'
import { Devotional } from '@prisma/client'
import Middlewares from '@Controllers/Middlewares'
import Prisma from '@Clients/Prisma'
import SchemaHelper from '@Helpers/SchemaHelper'
import jwt from 'jsonwebtoken'
import { zonedTimeToUtc } from 'date-fns-tz'

class Devotionals {
  constructor(private readonly app: Express) {
    this.getDevotionals()
    this.getDevotionalBySlug()

    Middlewares.IsAdmin(this.app)
    this.createDevotional()
    this.getDevotionalsAsAdmin()
    this.deleteDevocional()
  }

  getDevotionals() {
    this.app.get('/api/devotionals', async (_req: Request, res: Response) => {
      try {
        const response: Devotional[] = await Prisma.devotional.findMany({
          where: {
            scheduledTo: {
              lte: zonedTimeToUtc(new Date(), 'America/Sao_Paulo'),
            },
          },
          orderBy: {
            scheduledTo: 'desc',
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        })

        res.status(200).json(response)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  getDevotionalBySlug() {
    this.app.get('/api/devotionals/:slug', async (req: Request, res: Response) => {
      try {
        const { slug } = req.params

        const response: Devotional | null = await Prisma.devotional.findFirst({
          where: {
            slug,
            scheduledTo: {
              lte: zonedTimeToUtc(new Date(Date.now()), 'America/Sao_Paulo'),
            },
          },
          orderBy: {
            scheduledTo: 'desc',
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        })

        if (!response) return res.sendStatus(404)

        res.status(200).json(response)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  getDevotionalsAsAdmin() {
    this.app.get('/api/all-devotionals', async (_req: Request, res: Response) => {
      try {
        const response: Devotional[] = await Prisma.devotional.findMany({
          orderBy: {
            scheduledTo: 'desc',
          },
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        })

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

        const { body, title, scheduledTo } = req.body

        jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET as string,
          async (err: any, decoded: Decoded) => {
            if (err) return res.sendStatus(403)

            const devotional = await Prisma.devotional.create({
              data: {
                body,
                title,
                scheduledTo: zonedTimeToUtc(new Date(scheduledTo), 'America/Sao_Paulo'),
                userId: decoded.id,
                slug: title.replace(/\s+/g, '-').toLowerCase(),
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

  deleteDevocional() {
    this.app.delete('/api/devotionals/:id', async (req: Request, res: Response) => {
      try {
        const { id } = req.params

        await Prisma.devotional.delete({
          where: { id },
        })

        res.sendStatus(204)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}

export default Devotionals
