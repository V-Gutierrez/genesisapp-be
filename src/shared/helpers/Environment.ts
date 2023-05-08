/* eslint-disable no-console */
/* eslint-disable no-process-exit */
import { EnvConfigInterface } from '@Shared/types/interfaces'
import 'dotenv/config'

class Environment {
  public isProduction = process.env.NODE_ENV === 'production'

  constructor() {
    console.info('[Environment] Environment initialized with env set:', JSON.stringify(process.env))
  }

  public getEnv(name: keyof EnvConfigInterface): string {
    const variable = process.env[name]

    if (!variable) {
      console.error(`[Environment] Missing ${name} environment variable`)
      process.exit(1)
    }

    return variable
  }
}

export default new Environment()
