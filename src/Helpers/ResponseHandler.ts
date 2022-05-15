import { Response as ResponseType } from 'express'

class ResponseHandler<T> {
  constructor(
    private readonly Response: ResponseType,
    private readonly StatusCode: number,
    private readonly payload?: T,
  ) {
    this.Response.status(this.StatusCode).json(this.payload)
  }
}

export default ResponseHandler
