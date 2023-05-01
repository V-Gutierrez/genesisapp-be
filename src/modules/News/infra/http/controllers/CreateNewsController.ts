import NewsRepository from '@Modules/News/domain/repositories/NewsRepository'
import { TIMEZONE } from '@Shared/constants'
import Formatter from '@Shared/helpers/Formatter'
import SchemaHelper from '@Shared/helpers/SchemaHelper'
import ImageKit from '@Shared/services/ImageKit'
import { ImageKitFolders } from '@Shared/types/Enum'
import { HTTPController } from '@Shared/types/interfaces'
import { zonedTimeToUtc } from 'date-fns-tz'
import { Request, Response } from 'express'

export class CreateNewsController implements HTTPController {
  async execute(req: Request, res: Response) {
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
      })

      return res.status(201).json(news)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new CreateNewsController().execute
