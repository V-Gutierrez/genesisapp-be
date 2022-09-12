import Prisma from '@Clients/Prisma'
import { TIMEZONE } from '@Constants/index'
import { Prisma as PrismaType, Region } from '@prisma/client'
import { zonedTimeToUtc } from 'date-fns-tz'

class NewsModel {
  async create(data: PrismaType.NewsCreateInput) {
    return Prisma.news.create({
      data,
    })
  }

  async deleteById(id: string) {
    return Prisma.news.delete({
      where: {
        id,
      },
    })
  }

  async getBySlug(slug: string, region: Region) {
    return Prisma.news.findFirst({
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
        NewsLikes: true,
        NewsViews: true,
      },
    })
  }

  async getReleasedNews(region: Region) {
    return Prisma.news.findMany({
      where: {
        scheduledTo: {
          lte: zonedTimeToUtc(new Date(), TIMEZONE),
        },
        region,
      },
      orderBy: {
        scheduledTo: 'desc',
      },
    })
  }

  async getAll(region: Region) {
    return Prisma.news.findMany({
      orderBy: {
        scheduledTo: 'desc',
      },
      where: {
        region,
      },
    })
  }

  async like(id: string, userId: string) {
    try {
      const like = await Prisma.newsLikes.findFirst({
        where: {
          userId,
          newsId: id,
        },
      })

      if (like) {
        await Prisma.newsLikes.delete({
          where: {
            userId_newsId: {
              newsId: id,
              userId,
            },
          },
        })
      } else {
        await Prisma.newsLikes.create({
          data: {
            newsId: id,
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

      await Prisma.newsViews.upsert({
        create: {
          newsId: id,
          userId,
        },
        where: {
          userId_newsId: {
            newsId: id,
            userId,
          },
        },
        update: {
          newsId: id,
          userId,
        },
      })
    } catch (error) {
      console.log(error)
    }
  }
}

export default new NewsModel()
