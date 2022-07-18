import crypto from 'crypto'

class Formatter {
  static generateSlug = (str: string) =>
    str
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .toLowerCase()

  static sanitizeUserPhone = (phone: string) => phone.replace(/\s/gi, '').replace('-', '').trim()

  static sanitizeEmail = (email: string) => email.replace(/\s/gi, '').trim().toLocaleLowerCase()

  static getUserFirstName = (name: string) => name.split(' ')[0]

  static generateHashFromString = (str: string) =>
    crypto.createHash('sha256').update(str).digest('hex')
}

export default Formatter
