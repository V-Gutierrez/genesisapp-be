'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const GrowthGroupsRoutes_1 = __importDefault(require('../RoutesController/GrowthGroupsRoutes'))
const Middlewares_1 = __importDefault(require('../RoutesController/Middlewares'))
class RoutesController {
  constructor(app) {
    this.app = app
    new Middlewares_1.default(this.app)
    new GrowthGroupsRoutes_1.default(this.app)
  }
}
exports.default = RoutesController
