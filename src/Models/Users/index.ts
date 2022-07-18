import Bcrypt from '@Helpers/Bcrypt'
import Prisma from '@Clients/Prisma'
import { Prisma as PrismaType } from '@prisma/client'

class UserModel {
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

  async getAll() {
    return Prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        birthdate: true,
        phone: true,
        active: true,
      },
    })
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

export default new UserModel()
