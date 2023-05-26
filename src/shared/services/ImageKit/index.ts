import { Service } from '@Shared/services'
import ImageKitInstance from 'imagekit'
import { ImageKitFolders } from 'src/shared/types/Enum'
import { UploadResponse } from 'imagekit/dist/libs/interfaces/UploadResponse'
import Environment from '@Shared/helpers/Environment'

class ImageKit extends Service {
  private readonly imageKitInstance: ImageKitInstance

  constructor() {
    super()

    this.imageKitInstance = new ImageKitInstance({
      publicKey: Environment.getEnv('IMAGEKIT_PUBLIC_KEY'),
      privateKey: Environment.getEnv('IMAGEKIT_PRIVATE_KEY'),
      urlEndpoint: Environment.getEnv('IMAGEKIT_PROJECT_URL'),
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
