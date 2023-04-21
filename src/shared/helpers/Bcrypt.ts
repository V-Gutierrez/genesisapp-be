import 'dotenv/config'

import * as bcrypt from 'bcrypt'

class Bcrypt {
  static hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, process.env.BCRYPTSALT as string)
  }

  static comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}

export default Bcrypt
