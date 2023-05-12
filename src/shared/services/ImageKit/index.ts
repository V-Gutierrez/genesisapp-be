import { Service } from '@Shared/services'
import ImageKitInstance from 'imagekit'
import { ImageKitFolders } from 'src/shared/types/Enum'
import { UploadResponse } from 'imagekit/dist/libs/interfaces/UploadResponse'

class ImageKit extends Service {
  private readonly imageKitInstance: ImageKitInstance

  constructor() {
    super()

    this.imageKitInstance = new ImageKitInstance({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      urlEndpoint: process.env.IMAGEKIT_PROJECT_URL as string,
    })
  }

  public async uploadFile(
    file: Buffer,
    fileName: string,
    folder: ImageKitFolders,
  ): Promise<UploadResponse> {
    try {
      return this.imageKitInstance.upload({
        file,
        fileName,
        folder,
      })
    } catch (error) {
      console.error(error)
      throw new Error('Error in ImageKit Service')
    }
  }

  public async delete(fileId: string): Promise<void> {
    try {
      await this.imageKitInstance.deleteFile(fileId)
    } catch (error) {
      console.error(error)
      throw new Error('Error in ImageKit Service')
    }
  }
}

export default new ImageKit()
