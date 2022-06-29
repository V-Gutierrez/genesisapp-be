import { Express, Request, Response } from 'express'

import GooglePhotosScraper from '@Services/GooglePhotosScrapper'

class Integrations {
  static getGooglePhotosAlbumPhotos(app: Express) {
    app.get('/api/integrations/googlephotos/:albumUrl', async (req: Request, res: Response) => {
      try {
        const { albumUrl } = req.params

        const photos = await GooglePhotosScraper.fetchImagesByAlbumUrl(albumUrl)
        return res.status(200).json(photos)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }
}

export default Integrations
