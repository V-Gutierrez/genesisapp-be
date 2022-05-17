import { Express, Request, Response } from 'express'

import { Devotional } from '@prisma/client'
import Prisma from '@Clients/Prisma'
import ResponseHandler from 'src/Helpers/ResponseHandler'

class Devotionals {
  constructor(private readonly app: Express) {
    this.getDevotionals()
  }

  getDevotionals() {
    this.app.get('/api/devotionals', async (_req: Request, res: Response) => {
      try {
        const response: Devotional[] = await Prisma.devotional.findMany()

        new ResponseHandler(res, 200, response)
      } catch (error) {
        new ResponseHandler(res, 500, null)
      }
    })
  }

}

export default Devotionals