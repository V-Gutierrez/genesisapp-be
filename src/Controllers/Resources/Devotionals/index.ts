import { Express, Request, Response } from 'express'

import DevotionalModel from '@Models/Devotional'
import Formatter from '@Helpers/Formatter'
import ImageKitService from '@Services/ImageKitService'
import Middlewares from '@Controllers/Middlewares'
import SchemaHelper from '@Helpers/SchemaHelper'
import { zonedTimeToUtc } from 'date-fns-tz'
import { TIMEZONE } from '@Constants/index'
import { Errors, Success } from '@Helpers/Messages'
import { ImageKitFolders } from '../../../Types/Enum'

class Devotionals {
  static getDevotionals(app: Express) {
    app.get('/api/devotionals', async (req: Request, res: Response) => {
      const { region } = req.cookies.user ?? {}

      try {
        const response = await DevotionalModel.getReleasedDevotionals(region)

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
        const { id: userId, region } = req.cookies.user ?? {}

        const response = await DevotionalModel.getBySlug(slug, region)

        if (!response) return res.status(404).json({ message: Errors.RESOURCE_NOT_FOUND })

        await DevotionalModel.view(response.id, userId)

        return res.status(200).json(response)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static getDevotionalsAsAdmin(app: Express) {
    app.get('/api/all-devotionals', async (req: Request, res: Response) => {
      const { region } = req.cookies.user ?? {}

      try {
        const response = await DevotionalModel.getAll(region)

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
            return res.status(400).json({ message: errors })
          }
          if (!req.file) {
            return res.status(400).json({ message: 'coverImage is missing' })
          }

          const { body, title, scheduledTo, author } = req.body
          const { file } = req
          const { region } = req.cookies.user ?? {}

          const {
            url: coverImage,
            thumbnailUrl: coverThumbnail,
            fileId,
          } = await ImageKitService.uploadFile(
            file.buffer,
            Formatter.generateSlug(title),
            ImageKitFolders.Devotionals,
          )

          const devotional = await DevotionalModel.create({
            body,
            title,
            scheduledTo: zonedTimeToUtc(new Date(scheduledTo), TIMEZONE),
            author,
            slug: Formatter.generateSlug(title),
            coverImage,
            coverThumbnail,
            assetId: fileId,
            region,
          })

          return res.status(201).json(devotional)
        } catch (e) {
          res.sendStatus(500)
        }
      },
    )
  }

  static deleteDevotional(app: Express) {
    app.delete('/api/devotionals/:id', async (req: Request, res: Response) => {
      try {
        const { id } = req.params

        const deleted = await DevotionalModel.deleteById(id)

        await ImageKitService.delete(deleted.assetId)

        res.status(200).json({ message: Success.RESOURCE_DELETED })
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static like(app: Express) {
    app.post('/api/devotionals/:id/like', async (req: Request, res: Response) => {
      try {
        const { id } = req.params
        const { id: userId } = req.cookies.user ?? {}

        await DevotionalModel.like(id, userId)

        res.status(201).json({ status: Success.RESOURCE_CREATED })
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}

export default Devotionals
