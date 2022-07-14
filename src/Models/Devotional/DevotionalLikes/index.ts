import DevotionalModel from '@Models/Devotional'
import Prisma from '@Clients/Prisma'

class DevotionalLikesModel {
  async addLike(devotionalId: string, userId: string) {
    await DevotionalModel.addLike(devotionalId)

    return Prisma.devotionalLikes.create({
      data: {
        devotionalId,
        userId,
      },
    })
  }

  async removeLike(devotionalId: string, userId: string) {
    await DevotionalModel.removeLike(devotionalId)

    return Prisma.devotionalLikes.delete({
      where: {
        userId_devotionalId: {
          userId,
          devotionalId,
        },
      },
    })
  }

  async getDevotionalUserLike(userId: string, devotionalId: string) {
    const like = await Prisma.devotionalLikes.findFirst({
      where: {
        userId,
        devotionalId,
      },
    })

    if (like) {
      return true
    } 
      return false
    
  }
}

export default new DevotionalLikesModel()
