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

  async like(id: string, userId: string) {
    try {
      const like = await Prisma.galleryLikes.findFirst({
        where: {
          userId,
          galleryId: id,
        },
      })

      if (like) {
        await Prisma.galleryLikes.delete({
          where: {
            userId_galleryId: {
              galleryId: id,
              userId,
            },
          },
        })
      } else {
        await Prisma.galleryLikes.create({
          data: {
            galleryId: id,
            userId,
          },
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  async view(id: string, userId: string) {
    try {
      if (!userId) return

      await Prisma.galleryViews.upsert({
        create: {
          galleryId: id,
          userId,
        },
        where: {
          userId_galleryId: {
            galleryId: id,
            userId,
          },
        },
        update: {
          galleryId: id,
          userId,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }
}

export default new GalleriesRepository()
