import * as GIS from 'google-photos-album-image-url-fetch'

export interface GooglePhotosImageSet extends GIS.ImageInfo {
  smartCropped: string
  thumbnail: string
  minimalThumbnail: string
  highQuality: string
}
