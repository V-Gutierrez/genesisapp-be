import * as bcrypt from 'bcrypt'
import Environment from '@Shared/helpers/Environment'

class Bcrypt {
  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, Environment.getEnv('BCRYPTSALT'))
  }

  comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}

export default new Bcrypt()
