import { TIMEZONE } from 'src/shared/constants'
import { zonedTimeToUtc } from 'date-fns-tz'
import { Prisma as PrismaType, Region } from '@prisma/client'
import { isAfter } from 'date-fns'
import Prisma from '@Shared/infra/prisma'

class EventsRepository {
  async getAll() {
    return Prisma.events.findMany({
      orderBy: {
        subscriptionsScheduledTo: 'desc',
      },
      include: {
        _count: { select: { EventsSubscriptions: true } },
        EventsSubscriptions: true,
      },
    })
  }

  async getReleasedEvents(region: Region) {
    return Prisma.events.findMany({
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
      include: {
        _count: { select: { EventsSubscriptions: true } },
      },
      orderBy: {
        subscriptionsScheduledTo: 'desc',
      },
    })
  }

  async create(data: PrismaType.EventsCreateInput) {
    try {
      const isEventDateTheLaterDate =
        isAfter(new Date(data.eventDate), new Date(data.subscriptionsDueDate)) &&
        isAfter(new Date(data.eventDate), new Date(data.subscriptionsScheduledTo))

      const isSubscriptionDueDateLaterThanSubscriptionScheduledDate = isAfter(
        new Date(data.subscriptionsDueDate),
        new Date(data.subscriptionsScheduledTo),
      )

      if (isSubscriptionDueDateLaterThanSubscriptionScheduledDate && isEventDateTheLaterDate) {
        return Prisma.events.create({
          data,
        })
      }
      throw new Error(
        `Cannot create event because of: isEventDateTheLaterDate : ${isEventDateTheLaterDate}, isSubscriptionDueDateLaterThanSubscriptionScheduledDate: ${isSubscriptionDueDateLaterThanSubscriptionScheduledDate}`,
      )
    } catch (error) {
      console.error(error)
    }
  }

  async deleteById(id: string) {
    return Prisma.events.delete({
      where: {
        id,
      },
    })
  }

  async getEventById(id: string, region: Region) {
    return Prisma.events.findFirst({
      where: {
        id,
        eventDate: {
          gte: zonedTimeToUtc(new Date(), TIMEZONE),
        },
        subscriptionsDueDate: {
          gte: zonedTimeToUtc(new Date(), TIMEZONE),
        },
        region,
      },
      include: {
        _count: {
          select: {
            EventsSubscriptions: true,
          },
        },
      },
    })
  }

  async subscribeUserToEvent(
    userData: Omit<PrismaType.EventsSubscriptionsCreateInput, 'Event'>,
    eventId: string,
    region: Region,
  ) {
    const currentEvent = await this.getEventById(eventId, region)

    if (!currentEvent) throw new Error(`No available event found for ${eventId}`)

    const { maxSlots } = currentEvent
    const { EventsSubscriptions: subsCount } = currentEvent._count

    if (subsCount < maxSlots) {
      await Prisma.eventsSubscriptions.create({
        data: {
          ...userData,
          Event: {
            connect: {
              id: eventId,
            },
          },
        },
      })
    }
  }

  async removeSubscriptionById(subscriptionId: string) {
    await Prisma.eventsSubscriptions.delete({
      where: {
        id: subscriptionId,
      },
    })
  }
}

export default new EventsRepository()
