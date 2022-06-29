import * as GIS from 'google-photos-album-image-url-fetch'

import { ImageSet } from '@Types/DTO'

class GooglePhotosScrapper {
  private parseImageOptmizations(Images: GIS.ImageInfo[]): ImageSet[] {
    return Images.map((image) => ({
      ...image,
      smartCropped: `${image.url}=p`,
      thumbnail: `${image.url}=s400-p`,
      minimalThumbnail: `${image.url}=s100-p`,
    }))
  }

  async fetchImagesByAlbumUrl(albumUrl: string): Promise<ImageSet[]> {
    try {
      const result = await GIS.fetchImageUrls(albumUrl)

      return this.parseImageOptmizations(result as GIS.ImageInfo[])
    } catch (error) {
      throw new Error('Error in Google Photos Scrapper flow')
    }
  }
}

export default new GooglePhotosScrapper()
