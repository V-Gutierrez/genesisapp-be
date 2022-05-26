import isProduction from '@Helpers/Environment'

export default class CookieHelper {
  static AuthCookieDefaultOptions = {
    name: '100038189377123',
    config: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : undefined,
      maxAge: 60 * 60 * 24 * 30 * 1000,
    },
  }
}
