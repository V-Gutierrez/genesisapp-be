import { Request, Response } from 'express'

export interface HTTPController {
  execute(req: Request, res: Response): Promise<void>
}
