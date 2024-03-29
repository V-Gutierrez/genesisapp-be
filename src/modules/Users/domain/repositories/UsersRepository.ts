import { Prisma as PrismaType, Region } from '@prisma/client'
import Bcrypt from '@Shared/helpers/Bcrypt'
import Prisma from '@Shared/infra/prisma'

class UsersRepository {
  async getUserById(id: string) {
    return Prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        birthdate: true,
      },
    })
  }

  async getAll(region: Region, page: number, limit: number) {
    const skip = (page - 1) * limit

    const users = await Prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        birthdate: true,
        phone: true,
        active: true,
      },
      where: {
        region,
      },
      skip,
      take: limit,
    })

    const totalUsers = await Prisma.user.count({
      where: {
        region,
      },
    })

    return {
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    }
  }

  async create(data: PrismaType.UserCreateInput) {
    return Prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        phone: true,
        password: false,
      },
    })
  }

  async getUserByEmail(email: string) {
    return Prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        name: true,
        password: true,
        email: true,
        id: true,
        role: true,
        active: true,
        region: true,
      },
    })
  }

  async getUserByDecodedEmail(decodedEmail: string) {
    return Prisma.user.findFirst({
      where: {
        email: decodedEmail,
      },
      select: {
        id: true,
        email: true,
        role: true,
        region: true,
        UserRefreshTokens: true,
      },
    })
  }

  async activateUserById(id: string) {
    await Prisma.user.update({
      where: { id },
      data: { active: true },
    })
  }

  getActiveUserByEmail(email: string) {
    return Prisma.user.findFirst({
      where: { email },
      select: { email: true, active: true },
    })
  }

  async setUserPasswordByEmail(email: string, password: string) {
    await Prisma.user.update({
      where: { email },
      data: {
        password: await Bcrypt.hashPassword(password),
      },
    })
  }
}

export default new UsersRepository()
