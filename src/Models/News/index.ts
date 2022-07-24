import Prisma from '@Clients/Prisma'
import { Prisma as PrismaType } from '@prisma/client'
import { zonedTimeToUtc } from 'date-fns-tz'

class NewsModel {
  async create(data: PrismaType.NewsCreateInput) {
    return Prisma.news.create({
      data,
    })
  }

  async deleteById(id: string) {
    await Prisma.newsLikes.deleteMany({
      where: {
        newsId: id,
      },
    })

    await Prisma.newsViews.deleteMany({
      where: {
        newsId: id,
      },
    })

    return Prisma.news.delete({
      where: {
        id,
      },
    })
  }

  async getBySlug(slug: string) {
    return Prisma.news.findFirst({
      where: {
        slug,
        scheduledTo: {
          lte: zonedTimeToUtc(new Date(Date.now()), 'America/Sao_Paulo'),
        },
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

  async getReleasedNews() {
    return Prisma.news.findMany({
      where: {
        scheduledTo: {
          lte: zonedTimeToUtc(new Date(), 'America/Sao_Paulo'),
        },
      },
      orderBy: {
        scheduledTo: 'desc',
      },
    })
  }

  async getAll() {
    return Prisma.news.findMany({
      orderBy: {
        scheduledTo: 'desc',
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
        return Prisma.newsLikes.create({
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

      return Prisma.newsViews.upsert({
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
