import type { User } from '@prisma/client'

export type RegisterUser = Pick<User, 'email' | 'name' | 'password'>

export interface LoginUser {
	email: string
	password: string
}
