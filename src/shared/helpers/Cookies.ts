import { CookieHelperOptions } from '@Shared/types/dtos'
import isProduction from 'src/shared/helpers/Environment'

export default class CookieHelper {
  static AuthCookieDefaultOptions: CookieHelperOptions = {
    name: 'jwt',
    config: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : undefined,
      maxAge: 60 * 60 * 24 * 30 * 1000,
    },
  }
}
