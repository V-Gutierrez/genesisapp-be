import { Express, Request, Response } from 'express'

import { Devotional } from '@prisma/client'
import Prisma from '@Clients/Prisma'

class Devotionals {
  constructor(private readonly app: Express) {
    this.get()
  }

  get() {
    this.app.get('/api/devotionals', async (_req: Request, res: Response) => {
      try {
        const response: Devotional[] = await Prisma.devotional.findMany()

        res.status(200).json(response)
      } catch (error) {
        res.sendStatus(500)
      }
    })
  }

}

export default Devotionals