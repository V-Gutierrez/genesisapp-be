import { DevotionalCreationProps } from '@Models/Devotional/types'
import Prisma from '@Clients/Prisma'
import { zonedTimeToUtc } from 'date-fns-tz'

export class DevotionalModel {
  static async getReleasedDevotionals() {
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

  static async getBySlug(slug: string) {
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

  static async getAll() {
    return Prisma.devotional.findMany({
      orderBy: {
        scheduledTo: 'desc',
      },
    })
  }

  static async create(args: DevotionalCreationProps) {
    return Prisma.devotional.create({
      data: {
        ...args,
      },
    })
  }

  static async deleteById(id: string) {
    return Prisma.devotional.delete({
      where: { id },
    })
  }
}
