import { Prisma as PrismaType, Region } from '@prisma/client'
import { readingTime } from 'reading-time-estimator'
import { zonedTimeToUtc } from 'date-fns-tz'
import { TIMEZONE } from 'src/shared/constants'
import Prisma from '@Shared/infra/prisma'

class DevotionalsRepository {
  async getReleased(region: Region, page: number, perPage: number) {
    const skip = (page - 1) * perPage
    const take = perPage

    const devotionals = await Prisma.devotional.findMany({
      where: {
        scheduledTo: {
          lte: zonedTimeToUtc(new Date(), TIMEZONE),
        },
        region,
      },
      orderBy: {
        scheduledTo: 'desc',
      },
      skip,
      take,
    })

    const total = await Prisma.devotional.count({
      where: {
        scheduledTo: {
          lte: zonedTimeToUtc(new Date(), TIMEZONE),
        },
        region,
      },
    })

    const totalPages = Math.ceil(total / perPage)

    return {
      devotionals,
      total,
      totalPages,
      currentPage: page,
    }
  }

  async getBySlug(slug: string, region: Region) {
    return Prisma.devotional.findFirst({
      where: {
        slug,
        scheduledTo: {
          lte: zonedTimeToUtc(new Date(Date.now()), TIMEZONE),
        },
        region,
      },
      orderBy: {
        scheduledTo: 'desc',
      },
      include: {
        DevotionalLikes: {
          select: {
            User: {
              select: {
                name: true,
              },
            },
          },
        },
        DevotionalViews: {
          select: {
            User: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })
  }

  async getById(id: string, region: Region) {
    return Prisma.devotional.findFirst({
      where: {
        id,
        scheduledTo: {
          lte: zonedTimeToUtc(new Date(Date.now()), TIMEZONE),
        },
        region,
      },
      orderBy: {
        scheduledTo: 'desc',
      },
    })
  }

  async getAll(region: Region) {
    return Prisma.devotional.findMany({
      where: {
        region,
      },
      orderBy: {
        scheduledTo: 'desc',
      },
    })
  }

  async create(data: PrismaType.DevotionalCreateInput) {
    const readingTimeInMinutes = readingTime(data.body, 120).minutes

    return Prisma.devotional.create({
      data: {
        ...data,
        readingTimeInMinutes,
      },
    })
  }

  async deleteById(id: string) {
    return Prisma.devotional.delete({
      where: { id },
    })
  }

  async like(id: string, userId: string) {
    try {
      const like = await Prisma.devotionalLikes.findFirst({
        where: {
          userId,
          devotionalId: id,
        },
      })

      if (like) {
        await Prisma.devotionalLikes.delete({
          where: {
            userId_devotionalId: {
              devotionalId: id,
              userId,
            },
          },
        })
      } else {
        await Prisma.devotionalLikes.create({
          data: {
            devotionalId: id,
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

      await Prisma.devotionalViews.upsert({
        create: {
          devotionalId: id,
          userId,
        },
        where: {
          userId_devotionalId: {
            devotionalId: id,
            userId,
          },
        },
        update: {
          devotionalId: id,
          userId,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }
}

export default new DevotionalsRepository()
