import { Express, Request, Response } from 'express'

import { Devotional } from '@prisma/client'
import ImageKitService from '@Services/ImageKitService'
import Middlewares from '@Controllers/Middlewares'
import Prisma from '@Clients/Prisma'
import SchemaHelper from '@Helpers/SchemaHelper'
import { zonedTimeToUtc } from 'date-fns-tz'
import { generateSlug } from "../../../Helpers/Utils"
import { ImageKitFolders } from "../../../Types/Enum"

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
    app.post(
      '/api/devotionals',
      Middlewares.SingleFileUpload('coverImage'),
      async (req: Request, res: Response) => {
        try {
          const errors = SchemaHelper.validateSchema(SchemaHelper.DEVOTIONAL_CREATION, req.body)

          if (errors) {
            return res.status(400).json({ error: errors })
          }
          if (!req.file) {
            return res.status(400).json({ error: 'coverImage is missing' })
          }

          const { body, title, scheduledTo, author } = req.body
          const {file} = req

          const {
            url: coverImage,
            thumbnailUrl: coverThumbnail,
            fileId,
          } = await ImageKitService.uploadFile(
            file.buffer,
            generateSlug(title),
            ImageKitFolders.Devotionals,
          )

          const devotional = await Prisma.devotional.create({
            data: {
              body,
              title,
              scheduledTo: zonedTimeToUtc(new Date(scheduledTo), 'America/Sao_Paulo'),
              author,
              slug: generateSlug(title),
              coverImage,
              coverThumbnail,
              assetId: fileId,
            },
          })

          return res.status(201).json(devotional)
        } catch (e) {
          res.sendStatus(500)
        }
      },
    )
  }

  static deleteDevocional(app: Express) {
    app.delete('/api/devotionals/:id', async (req: Request, res: Response) => {
      try {
        const { id } = req.params

        const deleted = await Prisma.devotional.delete({
          where: { id },
        })

        await ImageKitService.delete(deleted.assetId)

        res.sendStatus(204)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}

export default Devotionals
