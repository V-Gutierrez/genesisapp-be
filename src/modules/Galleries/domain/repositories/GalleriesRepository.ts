import { Prisma as PrismaType, Region } from '@prisma/client'
import Prisma from '@Shared/infra/prisma'

class GalleriesRepository {
  async getAll(region: Region, page: number, limit: number) {
    const skip = (page - 1) * limit

    const galleries = await Prisma.gallery.findMany({
      where: {
        region,
      },
      skip,
      take: limit,
    })

    const totalGalleries = await Prisma.gallery.count({
      where: {
        region,
      },
    })

    return {
      galleries,
      currentPage: page,
      totalPages: Math.ceil(totalGalleries / limit),
    }
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
