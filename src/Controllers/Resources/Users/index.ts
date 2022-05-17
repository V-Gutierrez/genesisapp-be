import { Express, Request, Response } from 'express'

import Prisma from '@Clients/Prisma';
import ResponseHandler from 'src/Helpers/ResponseHandler';

class Users {
  constructor(private readonly app: Express) {
    this.get()
  }

  async get() {
    this.app.get('/api/users/:id', async (_req: Request, res: Response) => {
      const { id } = _req.params

      try {
        if (!id) new ResponseHandler(res, 401, { error: 'Missing id' })

        const user = await Prisma.user.findFirst({
          where: { id },
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
          }
        })

        if (!user) new ResponseHandler(res, 404, { error: 'User not found' })
        if (user) new ResponseHandler(res, 200, user)
      } catch (error) {
        new ResponseHandler(res, 500)
      }
    })
  }
}

export default Users