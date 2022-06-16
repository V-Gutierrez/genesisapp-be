import Prisma from '@Clients/Prisma'

export class GrowthGroupsModel {
  static async getAll() {
    return Prisma.growthGroup.findMany()
  }
}
