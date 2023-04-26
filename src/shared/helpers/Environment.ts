import 'dotenv/config'

class Environment {
  isProduction = process.env.NODE_ENV === 'production'

  public static getEnv<T>(name: string): T {
    const variable = process.env[name]

    if (!variable) {
      console.error(`[Environment] Missing ${name} environment variable`)
      process.exit(1)
    }

    return variable as unknown as T
  }

  public static getStringEnv(name: string): string {
    const variable = process.env[name]

    if (!variable) {
      console.error(`[Environment] Missing ${name} environment variable`)
      process.exit(1)
    }

    return variable
  }

  public static getNumberEnv(name: string): number {
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

  public static getBooleanEnv(name: string): boolean {
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
