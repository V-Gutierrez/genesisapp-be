import { Express, Request, Response } from 'express'

import GooglePhotosScraper from '@Shared/domain/services/GooglePhotosScrapper'

class Integrations {
  static getGooglePhotosAlbumPhotos(app: Express) {
    app.get('/api/integrations/googlephotos', async (req: Request, res: Response) => {
      try {
        const { albumUrl } = req.query

        const photos = await GooglePhotosScraper.fetchImagesByAlbumUrl(albumUrl as string)

        return res.status(200).json(photos)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}

export default Integrations
