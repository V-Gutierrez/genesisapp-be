import GetUserController from '@Modules/Users/infra/http/controllers/GetUserController'
import UserSignUpController from '@Modules/Users/infra/http/controllers/UserSignUpController'
import Middlewares from '@Shared/infra/http/middlewares'

import { Router } from 'express'

const UsersRouter = Router()

UsersRouter.route('/users/:id').get(Middlewares.Authentication, GetUserController)
UsersRouter.route('/users').post(UserSignUpController)

export default UsersRouter
