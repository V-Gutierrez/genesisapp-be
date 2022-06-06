import { Request } from 'express'
import parser from 'ua-parser-js'

class UserAgentParser {
  static getOS(req: Request) {
    return parser(req.headers['user-agent']).os.name
  }

  static isAppleDevice(req: Request) {
    return UserAgentParser.getOS(req) === 'iOS' || this.getOS(req) === 'Mac OS'
  }
}

export default UserAgentParser
