import { Service } from '@Shared/services'
import ImageKitInstance from 'imagekit'
import { ImageKitFolders } from 'src/shared/types/Enum'
import { UploadResponse } from 'imagekit/dist/libs/interfaces/UploadResponse'
import Environment from '@Shared/helpers/Environment'

class ImageKit extends Service {
  private readonly imageKitInstance: ImageKitInstance

  private readonly fakeUploadResponse: UploadResponse = {
    fileId: 'abc123',
    name: 'example.jpg',
    url: 'https://example.com/images/example.jpg',
    thumbnailUrl: 'https://example.com/images/example-thumbnail.jpg',
    height: 1080,
    width: 1920,
    size: 1024,
    fileType: 'image',
    filePath: '/images/example.jpg',
    tags: ['example', 'image'],
    isPrivateFile: false,
    customCoordinates: '0,0,1920,1080',
    metadata: 'some metadata',
    AITags: [{ tag: 'example', confidence: 0.8 }],
    extensionStatus: { status: 'success' },
  }

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
    if (!Environment.isProduction) return this.fakeUploadResponse

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
