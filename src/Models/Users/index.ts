import Bcrypt from '@Helpers/Bcrypt'
import Prisma from '@Clients/Prisma'
import { UserCreationProps } from '@Models/Users/types'

export class UserModel {
  static async getUserById(id: string) {
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

  static async getAll() {
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

  static async create(args: UserCreationProps) {
    return Prisma.user.create({
      data: {
        ...args,
      },
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

  static async getUserByEmail(email: string) {
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

  static async getUserByDecodedEmail(decodedEmail: string) {
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

  static async activateUserById(id: string) {
    await Prisma.user.update({
      where: { id },
      data: { active: true },
    })
  }

  static getActiveUserByEmail(email: string) {
    return Prisma.user.findFirst({
      where: { email },
      select: { email: true, active: true },
    })
  }

  static async setUserPasswordByEmail(email: string, password: string) {
    await Prisma.user.update({
      where: { email },
      data: {
        password: await Bcrypt.hashPassword(password),
      },
    })
  }
}
