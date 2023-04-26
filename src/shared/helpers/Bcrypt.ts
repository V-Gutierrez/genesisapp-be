import * as bcrypt from 'bcrypt'
import Environment from '@Shared/helpers/Environment'

class Bcrypt {
  static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, Environment.getStringEnv('BCRYPTSALT'))
  }

  static comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}

export default Bcrypt
