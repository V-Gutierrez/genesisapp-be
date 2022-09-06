import Prisma from '@Clients/Prisma'
import { TIMEZONE } from '@Constants/index'
import { zonedTimeToUtc } from 'date-fns-tz'

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
      Prisma.events.count({
        where: {
          subscriptionsScheduledTo: {
            lte: zonedTimeToUtc(new Date(), TIMEZONE),
          },
          eventDate: {
            gte: zonedTimeToUtc(new Date(), TIMEZONE),
          },
          subscriptionsDueDate: {
            gte: zonedTimeToUtc(new Date(), TIMEZONE),
          },
        },
      }),
    ]

    const [activeUsers, devotionals, growthGroups, news, ongoingEvents] = await Promise.all(
      promises,
    )

    return {
      activeUsers,
      devotionals,
      growthGroups,
      news,
      ongoingEvents,
    }
  }
}

export default new StatsModel()
