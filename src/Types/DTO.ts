import { User } from '@prisma/client'

export type Decoded = Pick<User, 'id' | 'email' | 'name' | 'role'> | any
