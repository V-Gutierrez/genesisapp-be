'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
class ResponseHandler {
  constructor(Response, StatusCode, payload) {
    this.Response = Response
    this.StatusCode = StatusCode
    this.payload = payload
    this.Response.status(this.StatusCode).json(this.payload)
  }
}
exports.default = ResponseHandler
