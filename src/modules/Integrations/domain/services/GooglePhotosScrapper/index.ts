import * as GIS from 'google-photos-album-image-url-fetch'
import { GooglePhotosImageSet } from './dtos'

class GooglePhotosScrapper {
  private parseImageOptmizations(
    Images: GIS.ImageInfo[],
  ): GooglePhotosImageSet[] {
    return Images.map((image) => ({
      ...image,
      smartCropped: `${image.url}=p`,
      thumbnail: `${image.url}=s400-p`,
      minimalThumbnail: `${image.url}=s100-p`,
      highQuality: `${image.url}=s3920`,
    }))
  }

  async fetchImagesByAlbumUrl(
    albumUrl: string,
  ): Promise<GooglePhotosImageSet[]> {
    try {
      const result = await GIS.fetchImageUrls(albumUrl)

      return this.parseImageOptmizations(result as GIS.ImageInfo[])
    } catch (error) {
      console.error(error)
      throw new Error('Error in Google Photos Scrapper flow')
    }
  }
}

export default new GooglePhotosScrapper()
