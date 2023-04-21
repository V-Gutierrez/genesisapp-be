import Prisma from '@Shared/infra/prisma'
import { TIMEZONE } from 'src/shared/constants'
import { Region } from '@prisma/client'
import { zonedTimeToUtc } from 'date-fns-tz'

class StatsRepository {
  async getStats(region: Region) {
    const promises = [
      Prisma.user.count({
        where: {
          active: true,
        },
      }),
      Prisma.devotional.count({
        where: {
          region,
        },
      }),
      Prisma.growthGroup.count({
        where: {
          region,
        },
      }),
      Prisma.news.count({
        where: {
          region,
        },
      }),
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
          region,
        },
      }),
    ]

    const [activeUsers, devotionals, growthGroups, news, ongoingEvents] =
      await Promise.all(promises)

    return {
      activeUsers,
      devotionals,
      growthGroups,
      news,
      ongoingEvents,
    }
  }
}

export default new StatsRepository()
