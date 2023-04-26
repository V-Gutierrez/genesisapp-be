import 'dotenv/config'

class Environment {
  public isProduction = process.env.NODE_ENV === 'production'

  constructor() {
    console.info(
      '[Environment] Environment initialized with env set:',
      JSON.stringify(process.env),
    )
  }

  public getEnv<T>(name: string): T {
    const variable = process.env[name]

    if (!variable) {
      console.error(`[Environment] Missing ${name} environment variable`)
      process.exit(1)
    }

    return variable as unknown as T
  }

  public getStringEnv(name: string): string {
    const variable = process.env[name]

    if (!variable) {
      console.error(`[Environment] Missing ${name} environment variable`)
      process.exit(1)
    }

    return variable
  }

  public getNumberEnv(name: string): number {
    const variable = process.env[name]

    if (!variable) {
      console.error(`[Environment] Missing ${name} environment variable`)
      process.exit(1)
    }

    const convertedNumber = Number(variable)

    if (Number.isNaN(convertedNumber)) {
      console.error(
        `[Environment] Value ${variable} of variable ${name} is not valid as a number`,
      )
      process.exit(1)
    }

    return convertedNumber
  }

  public getBooleanEnv(name: string): boolean {
    const variable = process.env[name]

    if (!variable) {
      console.error(`[Environment] Missing ${name} environment variable`)
      process.exit(1)
    }

    if (!variable.match(/true|false/)) {
      console.error(
        `[Environment] Value ${variable} of variable ${name} is not valid as a boolean`,
      )
      process.exit(1)
    }

    return variable === 'true'
  }
}

export default new Environment()
