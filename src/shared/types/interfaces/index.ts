/* eslint-disable no-unused-vars */
import { Request, Response } from 'express'

export interface HTTPController {
  execute(req: Request, res: Response): Promise<any>
}
