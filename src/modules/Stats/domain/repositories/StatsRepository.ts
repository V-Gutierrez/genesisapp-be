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
      Prisma.gallery.count({
        where: {
          region,
        },
      }),
    ]

    const {
      0: activeUsers,
      1: devotionals,
      2: growthGroups,
      3: news,
      4: ongoingEvents,
      5: galleries,
    } = await Promise.all(promises)

    return {
      activeUsers,
      devotionals,
      growthGroups,
      news,
      ongoingEvents,
      galleries,
    }
  }
}

export default new StatsRepository()
