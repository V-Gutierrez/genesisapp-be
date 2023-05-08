import { Region } from '@prisma/client'

class RegionRepository {
  private translateRegion(region: Region) {
    if (region === Region.AEP) return 'Buenos Aires'
    if (region === Region.FEC) return 'Feira de Santana'

    throw new Error('Invalid region')
  }

  async getAll() {
    return Object.entries(Region).map(([key, value]) => ({
      regionKey: key,
      regionTitle: this.translateRegion(value),
    }))
  }

  getRegionName(regionKey: string) {
    return this.translateRegion(Region[regionKey as keyof typeof Region])
  }
}

export default new RegionRepository()
