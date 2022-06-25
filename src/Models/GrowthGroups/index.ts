import Prisma from '@Clients/Prisma'

class GrowthGroupsModel {
  async getAll() {
    return Prisma.growthGroup.findMany()
  }
}

export default new GrowthGroupsModel()
