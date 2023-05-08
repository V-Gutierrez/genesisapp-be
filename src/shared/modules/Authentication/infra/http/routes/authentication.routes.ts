import Middlewares from '@Shared/infra/http/middlewares'
import ActivateUserController from '@Shared/modules/Authentication/infra/http/controllers/ActivateUserController'
import AuthenticateController from '@Shared/modules/Authentication/infra/http/controllers/AuthenticateController'
import FetchTokenInformationController from '@Shared/modules/Authentication/infra/http/controllers/FetchTokenInformationController'
import LogoutController from '@Shared/modules/Authentication/infra/http/controllers/LogoutController'
import RefreshTokenController from '@Shared/modules/Authentication/infra/http/controllers/RefreshTokenController'
import ResetPasswordController from '@Shared/modules/Authentication/infra/http/controllers/ResetPasswordController'
import SetNewUserPasswordController from '@Shared/modules/Authentication/infra/http/controllers/SetNewUserPasswordController'

import { Router } from 'express'

const AuthenticationRouter = Router()

AuthenticationRouter.route('/auth').post(AuthenticateController)

AuthenticationRouter.route('/auth').get(Middlewares.Authentication, RefreshTokenController)
AuthenticationRouter.route('/auth/activate').post(ActivateUserController)

AuthenticationRouter.route('/auth/reset-password').post(ResetPasswordController)

AuthenticationRouter.route('/auth/reset-password').put(SetNewUserPasswordController)

AuthenticationRouter.route('/auth/logout').delete(Middlewares.Authentication, LogoutController)
AuthenticationRouter.route('/auth/me').get(FetchTokenInformationController)

export default AuthenticationRouter
