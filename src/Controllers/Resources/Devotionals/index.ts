import { Express, Request, Response } from 'express'

import { Devotional } from '@prisma/client'
import Prisma from '@Clients/Prisma'
import SchemaHelper from '@Helpers/SchemaHelper'
import { zonedTimeToUtc } from 'date-fns-tz'

class Devotionals {
  static getDevotionals(app: Express) {
    app.get('/api/devotionals', async (_req: Request, res: Response) => {
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
        })

        res.status(200).json(response)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static getDevotionalBySlug(app: Express) {
    app.get('/api/devotionals/:slug', async (req: Request, res: Response) => {
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
        })

        if (!response) return res.sendStatus(404)

        res.status(200).json(response)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static getDevotionalsAsAdmin(app: Express) {
    app.get('/api/all-devotionals', async (_req: Request, res: Response) => {
      try {
        const response: Devotional[] = await Prisma.devotional.findMany({
          orderBy: {
            scheduledTo: 'desc',
          },
        })

        res.status(200).json(response)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static createDevotional(app: Express) {
    app.post('/api/devotionals', async (req: Request, res: Response) => {
      try {
        const errors = SchemaHelper.validateSchema(SchemaHelper.DEVOTIONAL_CREATION, req.body)

        if (errors) {
          return res.status(400).json({ error: errors })
        }

        const { body, title, scheduledTo, author } = req.body

        const devotional = await Prisma.devotional.create({
          data: {
            body,
            title,
            scheduledTo: zonedTimeToUtc(new Date(scheduledTo), 'America/Sao_Paulo'),
            author,
            slug: title.replace(/\s+/g, '-').toLowerCase(),
          },
        })

        return res.status(201).json(devotional)
      } catch (e) {
        res.sendStatus(500)
      }
    })
  }

  static deleteDevocional(app: Express) {
    app.delete('/api/devotionals/:id', async (req: Request, res: Response) => {
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
