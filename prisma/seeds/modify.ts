import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Running modify script...')

  await prisma.devotional.deleteMany({})
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
