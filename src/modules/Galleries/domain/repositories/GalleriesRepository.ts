import { Region } from '@prisma/client'
import Prisma from '@Shared/infra/prisma'

class GalleriesRepository {
  async getAll(region: Region) {
    return Prisma.gallery.findMany({
      where: {
        region,
      },
    })
  }

  async getById(id: string, region: Region) {
    return Prisma.gallery.findFirst({
      where: {
        id,
        region,
      },
    })
  }

  async deleteById(id: string) {
    return Prisma.devotional.delete({
      where: { id },
    })
  }
}

export default new GalleriesRepository()
