import GalleriesRepository from '@Modules/Galleries/domain/repositories/GalleriesRepository'
import Environment from '@Shared/helpers/Environment'
import Formatter from '@Shared/helpers/Formatter'
import { Errors } from '@Shared/helpers/Messages'
import SchemaHelper from '@Shared/helpers/SchemaHelper'
import ImageKit from '@Shared/services/ImageKit'
import OneSignal from '@Shared/services/OneSignal'
import { ImageKitFolders } from '@Shared/types/Enum'
import { HTTPController } from '@Shared/types/interfaces'
import { Request, Response } from 'express'

export class CreateGalleryController implements HTTPController {
  async execute(req: Request, res: Response): Promise<any> {
    try {
      const errors = SchemaHelper.validateSchema(SchemaHelper.GALLERY_CREATION, req.body)

      if (errors) {
        return res.status(400).json({ message: errors })
      }

      if (!req.file) {
        return res.status(400).json({ message: 'coverImage is missing' })
      }

      const { region } = req.cookies.user ?? {}
      const { title, googlePhotosAlbumUrl } = req.body
      const { file } = req

      const {
        url: coverImage,
        thumbnailUrl: coverThumbnail,
        fileId,
      } = await ImageKit.uploadFile(
        file.buffer,
        Formatter.generateSlug(title),
        ImageKitFolders.Galleries,
      )

      const created = await GalleriesRepository.create({
        title,
        coverImage,
        coverThumbnail,
        assetId: fileId,
        region,
        googlePhotosAlbumUrl,
      })

      await OneSignal.send(
        'Nova galeria',
        `Veja a galeria "${title}" no app da Gênesis Church`,
        `${Environment.getEnv('FRONT_BASE_URL')}/galerias/${created.id}`,
        undefined,
        created?.region,
      )

      return res.status(201).json(created)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: Errors.INTERNAL_SERVER_ERROR })
    }
  }
}

export default new CreateGalleryController().execute
