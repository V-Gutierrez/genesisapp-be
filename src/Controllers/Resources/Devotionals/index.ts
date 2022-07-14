import { Express, Request, Response } from 'express'

import CookieHelper from '@Helpers/Cookies'
import { Decoded } from '@Types/DTO'
import { Devotional } from '@prisma/client'
import DevotionalLikesModel from '@Models/Devotional/DevotionalLikes'
import DevotionalModel from '@Models/Devotional'
import Formatter from '@Helpers/Formatter'
import ImageKitService from '@Services/ImageKitService'
import Middlewares from '@Controllers/Middlewares'
import SchemaHelper from '@Helpers/SchemaHelper'
import jwt from 'jsonwebtoken'
import { zonedTimeToUtc } from 'date-fns-tz'
import { ImageKitFolders } from '../../../Types/Enum'

class Devotionals {
  static getDevotionals(app: Express) {
    app.get('/api/devotionals', async (_req: Request, res: Response) => {
      try {
        const response: Devotional[] = await DevotionalModel.getReleasedDevotionals()

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
        const { [CookieHelper.AuthCookieDefaultOptions.name]: accessToken } = req.cookies

        const response: Devotional | null = await DevotionalModel.getBySlug(slug)

        if (!response) return res.sendStatus(404)
        
          jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET as string,
            async (err: any, decoded: Decoded) => {
              if (err) return res.status(200).json(response)

              const { id } = decoded
              const userLiked = await DevotionalLikesModel.getDevotionalUserLike(id, response.id)

              await DevotionalModel.addView(slug)
              return res.status(200).json({ ...response, userLiked })
            },
          )
        
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static getDevotionalsAsAdmin(app: Express) {
    app.get('/api/all-devotionals', async (_req: Request, res: Response) => {
      try {
        const response: Devotional[] = await DevotionalModel.getAll()

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
          const { file } = req

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
            scheduledTo: zonedTimeToUtc(new Date(scheduledTo), 'America/Sao_Paulo'),
            author,
            slug: Formatter.generateSlug(title),
            coverImage,
            coverThumbnail,
            assetId: fileId,
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

        const deleted = await DevotionalModel.deleteById(id)

        await ImageKitService.delete(deleted.assetId)

        res.sendStatus(204)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static likeDevotional(app: Express) {
    app.put('/api/devotionals/:id', async (req: Request, res: Response) => {
      try {
        const { id } = req.params
        const { [CookieHelper.AuthCookieDefaultOptions.name]: accessToken } = req.cookies

        jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET as string,
          async (err: any, decoded: Decoded) => {
            if (err) return res.sendStatus(401)

            const { id: userId } = decoded

            const liked = await DevotionalLikesModel.getDevotionalUserLike(userId, id)

            if (liked) {
              await DevotionalLikesModel.removeLike(id, userId)
            } else {
              await DevotionalLikesModel.addLike(id, userId)
            }

            return res.sendStatus(201)
          },
        )
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}

export default Devotionals
