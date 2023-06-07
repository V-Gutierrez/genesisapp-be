import Prisma from '@Shared/infra/prisma'
import { TIMEZONE } from 'src/shared/constants'
import { Prisma as PrismaType, Region } from '@prisma/client'
import { zonedTimeToUtc } from 'date-fns-tz'

class NewsRepository {
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
        NewsLikes: {
          select: {
            User: {
              select: {
                name: true,
              },
            },
          },
        },
        NewsViews: {
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

  async getReleasedNews(region: Region, page: number, perPage: number, isHighlight = false) {
    const skip = (page - 1) * perPage
    const take = perPage

    const [data, count] = await Promise.all([
      Prisma.news.findMany({
        where: {
          scheduledTo: {
            lte: zonedTimeToUtc(new Date(), TIMEZONE),
          },
          region,
          isHighlight,
        },
        orderBy: {
          scheduledTo: 'desc',
        },
        skip,
        take,
      }),
      Prisma.news.count({
        where: {
          scheduledTo: {
            lte: zonedTimeToUtc(new Date(), TIMEZONE),
          },
          region,
        },
      }),
    ])

    return {
      news: data,
      count,
      totalPages: Math.ceil(count / perPage),
      currentPage: page,
    }
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
      console.error(error)
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
      console.error(error)
    }
  }
}

export default new NewsRepository()
