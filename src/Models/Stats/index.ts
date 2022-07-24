import Prisma from '@Clients/Prisma'

class StatsModel {
  async getStats() {
    const promises = [
      Prisma.user.count({
        where: {
          active: true,
        },
      }),
      Prisma.devotional.count(),
      Prisma.growthGroup.count(),
      Prisma.news.count(),
    ]

    const [activeUsers, devotionals, growthGroups, news] = await Promise.all(promises)

    return {
      activeUsers,
      devotionals,
      growthGroups,
      news,
    }
  }
}

export default new StatsModel()
