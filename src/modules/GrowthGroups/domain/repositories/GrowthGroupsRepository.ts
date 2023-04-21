import Prisma from '@Shared/infra/prisma'
import { Region } from '@prisma/client'

class GrowthGroupsRepository {
  async getAll(region: Region) {
    return Prisma.growthGroup.findMany({ where: { region } })
  }
}

export default new GrowthGroupsRepository()
