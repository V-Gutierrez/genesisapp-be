import * as GIS from 'google-photos-album-image-url-fetch'

class GooglePhotosScrapper {
  static async fetchImagesByAlbumUrl(albumUrl: string) {
    try {
      return GIS.fetchImageUrls(albumUrl)
    } catch (error) {
      console.log('Error in Google Photos Scraper flow')
    }
  }
}

export default GooglePhotosScrapper
