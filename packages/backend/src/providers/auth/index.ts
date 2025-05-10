import {
	BadRequestException,
	ConflictException,
	Inject,
	Injectable,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import type { RegisterUser } from 'src/types'
import { JwtService } from '@nestjs/jwt'

import { PrismaProvider } from '../prisma'

@Injectable()
export default class AuthProvider {
	@Inject()
	private prisma: PrismaProvider
	@Inject()
	private jwt: JwtService

	async register(user: RegisterUser) {
		await this.validateUserRegistration(user)

		const hashedPassword = await this.hashPassword(user.password)
		const newUser = await this.prisma.user.create({
			data: {
				email: user.email,
				name: user.name,
				password: hashedPassword,
			},
		})

		const payload = {
			id: newUser.id,
			email: newUser.email,
			name: newUser.name,
		}

		return {
			user: payload,
			accessToken: this.jwt.sign(payload),
		}
	}

	private async validateUserRegistration(user: RegisterUser) {
		if (!user || !user.email || !user.name || !user.password) {
			throw new BadRequestException('Faltan campos requeridos')
		}

		const existingUser = await this.prisma.user.findUnique({
			where: { email: user.email },
		})

		if (existingUser) {
			throw new ConflictException('Ya existe un usuario con ese email')
		}
	}

	private async hashPassword(password: string) {
		return bcrypt.hash(password, 10)
	}
}
