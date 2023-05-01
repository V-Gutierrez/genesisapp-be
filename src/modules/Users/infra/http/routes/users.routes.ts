import GetAllUsersAsAdminController from '@Modules/Users/infra/http/controllers/GetAllUsersAsAdminController'
import GetUserController from '@Modules/Users/infra/http/controllers/GetUserController'
import UserSignUpController from '@Modules/Users/infra/http/controllers/UserSignUpController'
import Middlewares from '@Shared/infra/http/middlewares'

import { Router } from 'express'

const UsersRouter = Router()

UsersRouter.route('/users/:id').get(
  Middlewares.Authentication,
  GetUserController,
)
UsersRouter.route('/users').post(UserSignUpController)

UsersRouter.route('/admin/users/').get(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  GetAllUsersAsAdminController,
)

export default UsersRouter
