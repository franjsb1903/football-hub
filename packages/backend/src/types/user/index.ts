import type { User } from '@prisma/client'

export type RegisterUser = Pick<User, 'email' | 'name' | 'password'>
