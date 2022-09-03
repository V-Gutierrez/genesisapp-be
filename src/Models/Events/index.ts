import { TIMEZONE } from '@Constants/index'
import Prisma from '@Clients/Prisma'
import { zonedTimeToUtc } from 'date-fns-tz'
import { Prisma as PrismaType } from '@prisma/client'

class EventsModel {
  async getAll() {
    return Prisma.events.findMany({
      orderBy: {
        scheduledTo: 'desc',
      },
    })
  }

  async getReleasedEvents() {
    return Prisma.events.findMany({
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

  async deleteEventById(id: string) {
    return Prisma.events.delete({
      where: {
        id,
      },
    })
  }

  async getEventById(id: string) {
    return Prisma.events.findFirst({
      where: {
        id,
      },
    })
  }

  async subscribeUserToEvent(userData: PrismaType.EventsSubscriptionsCreateInput) {
    await Prisma.eventsSubscriptions.create({
      data: userData,
    })
  }

  async removeSubscriptionById(subscriptionId: string) {
    await Prisma.eventsSubscriptions.delete({
      where: {
        id: subscriptionId,
      },
    })
  }
}

export default new EventsModel()
