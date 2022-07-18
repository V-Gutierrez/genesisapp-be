import { Express, Request, Response } from 'express'

import Formatter from '@Helpers/Formatter'
import { ImageKitFolders } from '@Types/Enum'
import ImageKitService from '@Services/ImageKitService'
import Middlewares from '@Controllers/Middlewares'
import NewsModel from '@Models/News'
import SchemaHelper from '@Helpers/SchemaHelper'
import { zonedTimeToUtc } from 'date-fns-tz'

class News {
  static createNews(app: Express) {
    app.post(
      '/api/news',
      Middlewares.SingleFileUpload('coverImage'),
      async (req: Request, res: Response) => {
        try {
          const errors = SchemaHelper.validateSchema(SchemaHelper.NEWS_CREATION, req.body)

          if (errors) {
            return res.status(400).json({ error: errors })
          }

          if (!req.file) {
            return res.status(400).json({ error: 'coverImage is missing' })
          }

          const { body, title, scheduledTo } = req.body
          const { file } = req

          const {
            url: coverImage,
            thumbnailUrl: coverThumbnail,
            fileId,
          } = await ImageKitService.uploadFile(
            file.buffer,
            Formatter.generateSlug(title),
            ImageKitFolders.News,
          )

          const news = await NewsModel.create({
            body,
            title,
            scheduledTo: zonedTimeToUtc(new Date(scheduledTo), 'America/Sao_Paulo'),
            coverImage,
            coverThumbnail,
            slug: Formatter.generateSlug(title),
            assetId: fileId,
          })

          return res.status(201).json(news)
        } catch (error) {
          res.sendStatus(500)
        }
      },
    )
  }

  static deleteNews(app: Express) {
    app.delete('/api/news/:id', async (req: Request, res: Response) => {
      try {
        const { id } = req.params

        const deleted = await NewsModel.deleteById(id)

        await ImageKitService.delete(deleted.assetId)

        res.sendStatus(204)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static getNewsAsAdmin(app: Express) {
    app.get('/api/all-news', async (_req: Request, res: Response) => {
      try {
        const response = await NewsModel.getAll()

        res.status(200).json(response)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static getNews(app: Express) {
    app.get('/api/news', async (_req: Request, res: Response) => {
      try {
        const response = await NewsModel.getReleasedNews()

        res.status(200).json(response)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static getNewsBySlug(app: Express) {
    app.get('/api/news/:slug', async (req: Request, res: Response) => {
      try {
        const { slug } = req.params
        const { id: userId } = req.body.user ?? {}
        const response = await NewsModel.getBySlug(slug)

        if (!response) return res.sendStatus(404)
        
          await NewsModel.view(response.id, userId)
          return res.status(200).json(response)
        
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}

export default News
