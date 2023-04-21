import { Request, Response } from 'express'

import GooglePhotosScraper from 'src/modules/Integrations/domain/services/GooglePhotosScrapper'

class IntegrationsController {
  static async getGooglePhotosAlbumPhotos(req: Request, res: Response) {
    try {
      const { albumUrl } = req.query

      const photos = await GooglePhotosScraper.fetchImagesByAlbumUrl(
        albumUrl as string,
      )

      return res.status(200).json(photos)
    } catch (error) {
      res.sendStatus(500)
    }
  }
}

export default IntegrationsController
