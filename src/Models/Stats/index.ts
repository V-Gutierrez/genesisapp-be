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
    ]

    const [activeUsers, devotionals, growthGroups] = await Promise.all(promises)

    return {
      activeUsers,
      devotionals,
      growthGroups,
    }
  }
}

export default new StatsModel()
