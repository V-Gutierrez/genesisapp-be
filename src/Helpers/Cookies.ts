import isProduction from '@Helpers/Environment'

export default class CookieHelper {
  static AuthCookieDefaultOptions = {
    name: 'jwt',
    config: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'lax' : undefined,
      maxAge: 60 * 60 * 24 * 30 * 1000,
    },
  }
}
