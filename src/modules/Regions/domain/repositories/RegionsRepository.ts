import { Region } from '@prisma/client'

class RegionRepository {
  private translateRegion(region: Region) {
    if (region === Region.AEP) return 'Buenos Aires'
    if (region === Region.FEC) return 'Feira de Santana'
    return '-'
  }

  async fetchAll() {
    return Object.entries(Region).map(([key, value]) => ({
      regionKey: key,
      regionTitle: this.translateRegion(value),
    }))
  }
}

export default new RegionRepository()
