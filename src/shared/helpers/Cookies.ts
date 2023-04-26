import Environment from '@Shared/helpers/Environment'
import { CookieHelperOptions } from '@Shared/types/dtos'

export default class CookieHelper {
  static AuthCookieDefaultOptions: CookieHelperOptions = {
    name: 'jwt',
    config: {
      httpOnly: true,
      secure: Environment.isProduction,
      sameSite: Environment.isProduction ? 'none' : undefined,
      maxAge: 60 * 60 * 24 * 30 * 1000,
    },
  }
}
