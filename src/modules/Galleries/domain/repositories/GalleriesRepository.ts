import { Prisma as PrismaType, Region } from '@prisma/client'
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
    return Prisma.gallery.delete({
      where: { id },
    })
  }

  async create(data: PrismaType.GalleryCreateInput) {
    return Prisma.gallery.create({
      data,
    })
  }
}

export default new GalleriesRepository()
