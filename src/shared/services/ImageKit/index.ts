import ImageKitInstance from 'imagekit'
import { ImageKitFolders } from 'src/shared/types/Enum'
import { UploadResponse } from 'imagekit/dist/libs/interfaces/UploadResponse'

class ImageKit {
  private readonly imageKitInstance: ImageKitInstance

  constructor() {
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
      throw new Error('Error in ImageKitService')
    }
  }

  public async delete(fileId: string): Promise<void> {
    try {
      await this.imageKitInstance.deleteFile(fileId)
    } catch (error) {
      console.error(error)
      throw new Error('Error in ImageKitService')
    }
  }
}

export default new ImageKit()
