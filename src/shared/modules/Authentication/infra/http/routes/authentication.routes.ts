import Middlewares from 'src/shared/infra/http/middlewares'
import AuthenticationController from 'src/shared/modules/Authentication/infra/http/controllers/AuthenticationController'
import { Router } from 'express'

const AuthenticationRouter = Router()

AuthenticationRouter.route('/auth').post(AuthenticationController.authenticate)

AuthenticationRouter.route('/auth').get(
  Middlewares.Authentication,
  AuthenticationController.refreshToken,
)
AuthenticationRouter.route('/auth/activate').post(
  AuthenticationController.activateNewUser,
)

AuthenticationRouter.route('/auth/reset-password').post(
  AuthenticationController.resetPassword,
)
AuthenticationRouter.route('/auth/reset-password').put(
  AuthenticationController.setNewPassword,
)
AuthenticationRouter.route('/auth/logout').delete(
  Middlewares.Authentication,
  AuthenticationController.logout,
)
AuthenticationRouter.route('/auth/me').get(
  AuthenticationController.getUserInformation,
)

export default AuthenticationRouter
