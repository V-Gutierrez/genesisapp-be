import * as GIS from 'google-photos-album-image-url-fetch'

import { CookieOptions } from 'express'
import { User } from '@prisma/client'

export type Decoded = Pick<User, 'id' | 'email' | 'name' | 'role'> | any

export type CookieHelperOptions = { name: string; config: CookieOptions }

export interface GooglePhotosImageSet extends GIS.ImageInfo {
  smartCropped: string
  thumbnail: string
  minimalThumbnail: string
  highQuality: string
}
