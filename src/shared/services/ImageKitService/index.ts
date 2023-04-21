import 'dotenv/config'

import ImageKit from 'imagekit'
import { ImageKitFolders } from 'src/shared/types/Enum'
import { UploadResponse } from 'imagekit/dist/libs/interfaces/UploadResponse'

export default class ImageKitService {
  static async InitializeInstance() {
    return new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      urlEndpoint: process.env.IMAGEKIT_PROJECT_URL as string,
    })
  }

  static async uploadFile(
    file: Buffer,
    fileName: string,
    folder: ImageKitFolders,
  ): Promise<UploadResponse> {
    try {
      const Instance = await ImageKitService.InitializeInstance()

      return Instance.upload({
        file,
        fileName,
        folder,
      })
    } catch (error) {
      throw new Error('Error in ImageKitService')
    }
  }

  static async delete(fileId: string): Promise<void> {
    try {
      const Instance = await ImageKitService.InitializeInstance()
      await Instance.deleteFile(fileId)
    } catch (error) {
      throw new Error('Error in ImageKitService')
    }
  }
}
