import { CookieOptions } from 'express'
import { User } from '@prisma/client'

export type Decoded = Pick<User, 'id' | 'email' | 'name' | 'role'> | any

export type CookieHelperOptions = { name: string; config: CookieOptions }
