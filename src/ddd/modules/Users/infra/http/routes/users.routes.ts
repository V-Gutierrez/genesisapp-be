import Middlewares from '@Controllers/Middlewares'
import UsersController from '@Modules/Users/infra/http/controllers/UsersController'
import { Router } from 'express'

const UsersRouter = Router()

UsersRouter.route('/users/:id').get(Middlewares.Authentication, UsersController.get)
UsersRouter.route('/users').post(UsersController.signUp)
UsersRouter.route('/admin/users/').post(
  Middlewares.Authentication,
  Middlewares.AdminPermissioner,
  UsersController.getAllUsersAsAdmin,
)

export default UsersRouter
