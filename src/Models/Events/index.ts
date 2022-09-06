import { TIMEZONE } from '@Constants/index'
import Prisma from '@Clients/Prisma'
import { zonedTimeToUtc } from 'date-fns-tz'
import { Prisma as PrismaType } from '@prisma/client'
import { isAfter } from 'date-fns'

class EventsModel {
  async getAll() {
    return Prisma.events.findMany({
      orderBy: {
        subscriptionsScheduledTo: 'desc',
      },
      include: {
        _count: { select: { EventsSubscriptions: true } },
      },
    })
  }

  async getReleasedEvents() {
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
      console.log(error)
      return null
    }
  }

  async deleteById(id: string) {
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
        eventDate: {
          gte: zonedTimeToUtc(new Date(), TIMEZONE),
        },
        subscriptionsDueDate: {
          gte: zonedTimeToUtc(new Date(), TIMEZONE),
        },
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
  ) {
    const currentEvent = await this.getEventById(eventId)

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

export default new EventsModel()
