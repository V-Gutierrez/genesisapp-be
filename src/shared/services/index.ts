/* eslint-disable no-console */

export abstract class Service {
  constructor() {
    console.info(`[Service] ${this.constructor.name} initialized`)
  }
}
