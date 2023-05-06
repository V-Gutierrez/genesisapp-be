import { Request, Response } from 'express'
import GooglePhotosScraper from '@Modules/Integrations/domain/services/GooglePhotosScrapper'

export class GooglePhotosIntegrationController {
  async execute(req: Request, res: Response) {
    try {
      const { albumUrl } = req.query

      const photos = await GooglePhotosScraper.fetchImagesByAlbumUrl(albumUrl as string)

      res.status(200).json(photos)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new GooglePhotosIntegrationController().execute
