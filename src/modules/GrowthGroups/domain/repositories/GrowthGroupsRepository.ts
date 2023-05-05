import Prisma from '@Shared/infra/prisma'
import { Prisma as PrismaType, Region } from '@prisma/client'

class GrowthGroupsRepository {
  async getAll(region: Region) {
    return Prisma.growthGroup.findMany({ where: { region } })
  }

  async create(data: PrismaType.GrowthGroupCreateInput) {
    return Prisma.growthGroup.create({ data })
  }

  async deleteById(id: string) {
    return Prisma.growthGroup.delete({
      where: { id },
    })
  }
}

export default new GrowthGroupsRepository()
