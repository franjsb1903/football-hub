import { Inject, Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import type { LoginUser, RegisterUser } from 'src/types'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import UserRepository from 'src/repositories/user'
import {
	InvalidEmailFormatException,
	InvalidPasswordException,
	MissingRequiredFieldsException,
	UserAlreadyExistsException,
	UserNotFoundException,
} from 'src/exceptions/domain'

@Injectable()
export default class AuthProvider {
	@Inject()
	private userRepository: UserRepository
	@Inject()
	private jwt: JwtService

	async register(user: RegisterUser) {
		const existingUser = await this.userRepository.findByEmail(user.email)

		if (existingUser) {
			throw new UserAlreadyExistsException()
		}

		await this.validateUserRegistration(user)

		const hashedPassword = await this.hashPassword(user.password)
		const newUser = await this.userRepository.create({
			email: user.email,
			name: user.name,
			password: hashedPassword,
		})

		return newUser
	}

	async login(user: LoginUser) {
		if (!user || !user.email || !user.password) {
			throw new MissingRequiredFieldsException()
		}

		const savedUser = await this.userRepository.findByEmail(user.email)

		if (!savedUser) {
			throw new UserNotFoundException()
		}

		const isPasswordValid = await bcrypt.compare(
			user.password,
			savedUser.password || '',
		)

		if (!isPasswordValid) {
			throw new InvalidPasswordException()
		}

		const authUser = this.getUserPayloadAndToken(savedUser)

		return {
			user: {
				...authUser.user,
			},
			accessToken: authUser.accessToken,
		}
	}

	private async validateUserRegistration(user: RegisterUser) {
		if (!user || !user.email || !user.name || !user.password) {
			throw new MissingRequiredFieldsException()
		}

		if (
			!new RegExp(
				/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			).test(user.email)
		) {
			throw new InvalidEmailFormatException()
		}
	}

	private async hashPassword(password: string) {
		return bcrypt.hash(password, 10)
	}

	private getUserPayloadAndToken(user: User) {
		const payload = {
			id: user.id,
			email: user.email,
			name: user.name,
		}

		return {
			user: payload,
			accessToken: this.jwt.sign(payload),
		}
	}
}
