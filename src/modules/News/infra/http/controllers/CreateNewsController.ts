import NewsRepository from '@Modules/News/domain/repositories/NewsRepository'
import { TIMEZONE } from '@Shared/constants'
import Environment from '@Shared/helpers/Environment'
import Formatter from '@Shared/helpers/Formatter'
import { Errors } from '@Shared/helpers/Messages'
import SchemaHelper from '@Shared/helpers/SchemaHelper'
import ImageKit from '@Shared/services/ImageKit'
import OneSignal from '@Shared/services/OneSignal'
import { ImageKitFolders } from '@Shared/types/Enum'
import { HTTPController } from '@Shared/types/interfaces'
import { zonedTimeToUtc } from 'date-fns-tz'
import { Request, Response } from 'express'

export class CreateNewsController implements HTTPController {
  async execute(req: Request, res: Response) {
    try {
      const errors = SchemaHelper.validateSchema(SchemaHelper.NEWS_CREATION, req.body)

      if (errors) {
        return res.status(400).json({ message: errors })
      }

      if (!req.file) {
        return res.status(400).json({ message: 'coverImage is missing' })
      }

      const { body, title, scheduledTo, highlightText, isHighlight } = req.body
      const { file } = req
      const { region } = req.cookies.user ?? {}

      const {
        url: coverImage,
        thumbnailUrl: coverThumbnail,
        fileId,
      } = await ImageKit.uploadFile(
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
        isHighlight,
      })

      await OneSignal.send(
        'Nova notícia',
        `Confira: ${title}`,
        `${Environment.getEnv('FRONT_BASE_URL')}/noticias/${news.slug}`,
        zonedTimeToUtc(new Date(scheduledTo), TIMEZONE),
        news?.region,
      )

      return res.status(201).json(news)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: Errors.INTERNAL_SERVER_ERROR })
    }
  }
}

export default new CreateNewsController().execute
