import { DevotionalCreationProps } from '@Models/Devotional/types'
import Prisma from '@Clients/Prisma'
import { readingTime } from 'reading-time-estimator'
import { zonedTimeToUtc } from 'date-fns-tz'

class DevotionalModel {
  async getReleasedDevotionals() {
    return Prisma.devotional.findMany({
      where: {
        scheduledTo: {
          lte: zonedTimeToUtc(new Date(), 'America/Sao_Paulo'),
        },
      },
      orderBy: {
        scheduledTo: 'desc',
      },
    })
  }

  async getBySlug(slug: string) {
    return Prisma.devotional.findFirst({
      where: {
        slug,
        scheduledTo: {
          lte: zonedTimeToUtc(new Date(Date.now()), 'America/Sao_Paulo'),
        },
      },
      orderBy: {
        scheduledTo: 'desc',
      },
    })
  }

  async getAll() {
    return Prisma.devotional.findMany({
      orderBy: {
        scheduledTo: 'desc',
      },
    })
  }

  async create(args: Omit<DevotionalCreationProps, 'readingTimeInMinutes'>) {
    const readingTimeInMinutes = readingTime(args.body, 200).minutes

    return Prisma.devotional.create({
      data: {
        ...args,
        readingTimeInMinutes,
      },
    })
  }

  async deleteById(id: string) {
    return Prisma.devotional.delete({
      where: { id },
    })
  }
}

export default new DevotionalModel()
