'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const cors_1 = __importDefault(require('cors'))
class Middlewares {
  constructor(app) {
    this.app = app
    this.CORS()
    this.Logger()
  }
  CORS() {
    this.app.use((0, cors_1.default)({ origin: ['http://localhost:3000', 'http://192.168.0.56:3000/'] }))
  }
  Logger() {
    this.app.use((req, res, next) => {
      console.log(
        `${req.method} ${req.url} --- Origin: ${req.headers.origin} with Status Code: ${res.statusCode} - ${
          res.statusMessage
        } - ${Date.now()}`,
      )
      next()
    })
  }
}
exports.default = Middlewares
