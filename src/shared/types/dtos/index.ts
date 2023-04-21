import { CookieOptions } from 'express'
import { User } from '@prisma/client'

type DecodedPayload = 'id' | 'email' | 'name' | 'role' | 'region'
export type Decoded = Pick<User, DecodedPayload> | any
export type CookieHelperOptions = { name: string; config: CookieOptions }
