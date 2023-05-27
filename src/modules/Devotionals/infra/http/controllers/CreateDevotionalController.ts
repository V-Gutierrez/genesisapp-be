import DevotionalsRepository from '@Modules/Devotionals/domain/repositories/DevotionalsRepository'
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

export class CreateDevotionalController implements HTTPController {
  async execute(req: Request, res: Response) {
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
      } = await ImageKit.uploadFile(
        file.buffer,
        Formatter.generateSlug(title),
        ImageKitFolders.Devotionals,
      )

      const devotional = await DevotionalsRepository.create({
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

      await OneSignal.send(
        'Novo devocional',
        `Leia ${title} no app da Gênesis Church`,
        `${Environment.getEnv('FRONT_BASE_URL')}/devocionais/${devotional.slug}`,
        zonedTimeToUtc(new Date(scheduledTo), TIMEZONE),
      )

      return res.status(201).json(devotional)
    } catch (e) {
      console.error(e)
      return res.status(500).json({ error: Errors.INTERNAL_SERVER_ERROR })
    }
  }
}

export default new CreateDevotionalController().execute
