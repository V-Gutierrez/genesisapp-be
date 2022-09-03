import Prisma from '@Clients/Prisma'
import { Prisma as PrismaType } from '@prisma/client'
import { readingTime } from 'reading-time-estimator'
import { zonedTimeToUtc } from 'date-fns-tz'
import { TIMEZONE } from '@Constants/index'

class DevotionalModel {
  async getReleasedDevotionals() {
    return Prisma.devotional.findMany({
      where: {
        scheduledTo: {
          lte: zonedTimeToUtc(new Date(), TIMEZONE),
        },
      },
      orderBy: {
        scheduledTo: 'desc',
      },
    })
  }

  async getBySlug(slug: string) {
    return Prisma.devotional.findFirst({
      where: {
        slug,
        scheduledTo: {
          lte: zonedTimeToUtc(new Date(Date.now()), TIMEZONE),
        },
      },
      orderBy: {
        scheduledTo: 'desc',
      },
      include: {
        DevotionalLikes: true,
        DevotionalViews: true,
      },
    })
  }

  async getById(id: string) {
    return Prisma.devotional.findFirst({
      where: {
        id,
        scheduledTo: {
          lte: zonedTimeToUtc(new Date(Date.now()), TIMEZONE),
        },
      },
      orderBy: {
        scheduledTo: 'desc',
      },
    })
  }

  async getAll() {
    return Prisma.devotional.findMany({
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
      console.log(error)
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
      console.log(error)
    }
  }
}

export default new DevotionalModel()
