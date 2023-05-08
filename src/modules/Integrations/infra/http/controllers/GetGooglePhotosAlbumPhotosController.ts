import GooglePhotos from '@Shared/services/GooglePhotos'
import { Request, Response } from 'express'

export class GetGooglePhotosAlbumPhotosController {
  async execute(req: Request, res: Response) {
    try {
      const { albumUrl } = req.query

      const photos = await GooglePhotos.fetchImagesByAlbumUrl(albumUrl as string)

      res.status(200).json(photos)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  }
}

export default new GetGooglePhotosAlbumPhotosController().execute
