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
      include: {
        EventsSubscriptions: true,
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
      include: {
        _count: { select: { EventsSubscriptions: true } },
      },
      orderBy: {
        scheduledTo: 'desc',
      },
    })
  }

  async create(data: PrismaType.EventsCreateInput) {
    return Prisma.events.create({
      data,
    })
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
      },
    })
  }

  async subscribeUserToEvent(
    userData: Omit<PrismaType.EventsSubscriptionsCreateInput, 'Event'>,
    eventId: string,
  ) {
    const currentEvent = await Prisma.events.findFirst({
      where: {
        id: eventId,
      },
      include: {
        _count: {
          select: {
            EventsSubscriptions: true,
          },
        },
      },
    })

    if (!currentEvent) throw new Error(`No event found for ${eventId}`)

    const {maxSlots} = currentEvent
    const subsCount = currentEvent._count.EventsSubscriptions

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
    } else {
      
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
