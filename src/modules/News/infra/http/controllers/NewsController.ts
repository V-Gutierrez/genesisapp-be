import { Express, Request, Response } from 'express'

import { ImageKitFolders } from 'src/shared/types/Enum'
import ImageKitService from 'src/shared/domain/services/ImageKitService'
import { zonedTimeToUtc } from 'date-fns-tz'
import { TIMEZONE } from 'src/shared/constants'
import NewsRepository from 'src/modules/News/domain/repositories/NewsRepository'
import Formatter from 'src/shared/helpers/Formatter'
import { Success, Errors } from 'src/shared/helpers/Messages'
import SchemaHelper from 'src/shared/helpers/SchemaHelper'

class NewsController {
  static async createNews(req: Request, res: Response) {
    try {
      const errors = SchemaHelper.validateSchema(
        SchemaHelper.NEWS_CREATION,
        req.body,
      )

      if (errors) {
        return res.status(400).json({ message: errors })
      }

      if (!req.file) {
        return res.status(400).json({ message: 'coverImage is missing' })
      }

      const { body, title, scheduledTo, highlightText } = req.body
      const { file } = req
      const { region } = req.cookies.user ?? {}

      const {
        url: coverImage,
        thumbnailUrl: coverThumbnail,
        fileId,
      } = await ImageKitService.uploadFile(
        file.buffer,
        Formatter.generateSlug(title),
        ImageKitFolders.News,
      )

      const news = await NewsRepository.create({
        body,
        title,
        scheduledTo: zonedTimeToUtc(new Date(scheduledTo), TIMEZONE),
        coverImage,
        coverThumbnail,
        slug: Formatter.generateSlug(title),
        assetId: fileId,
        highlightText,
        region,
      })

      return res.status(201).json(news)
    } catch (error) {
      res.sendStatus(500)
    }
  }

  static async deleteNews(req: Request, res: Response) {
    try {
      const { id } = req.params

      const deleted = await NewsRepository.deleteById(id)

      await ImageKitService.delete(deleted.assetId)

      res.status(200).json({ message: Success.RESOURCE_DELETED })
    } catch (error) {
      res.sendStatus(500)
    }
  }

  static async getNewsAsAdmin(req: Request, res: Response) {
    const { region } = req.cookies.user ?? {}

    try {
      const response = await NewsRepository.getAll(region)

      res.status(200).json(response)
    } catch (error) {
      res.sendStatus(500)
    }
  }

  static getNews(app: Express) {
    app.get('/api/news', async (req: Request, res: Response) => {
      const { region } = req.cookies.user ?? {}

      try {
        const response = await NewsRepository.getReleasedNews(region)

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
        const { id: userId, region } = req.cookies.user ?? {}

        const response = await NewsRepository.getBySlug(slug, region)

        if (!response)
          return res.status(404).json({ message: Errors.RESOURCE_NOT_FOUND })

        await NewsRepository.view(response.id, userId)

        return res.status(200).json(response)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

  static like(app: Express) {
    app.post('/api/news/:id/like', async (req: Request, res: Response) => {
      try {
        const { id } = req.params
        const { id: userId } = req.cookies.user ?? {}

        await NewsRepository.like(id, userId)

        res.status(201).json({ message: Success.RESOURCE_CREATED })
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}

export default NewsController
