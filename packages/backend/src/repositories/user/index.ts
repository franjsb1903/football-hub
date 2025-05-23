import { Inject, Injectable } from '@nestjs/common'
import { RegisterUser } from 'src/types'
import { PrismaProvider } from 'src/providers'

@Injectable()
export default class UserRepository {
	@Inject()
	prisma: PrismaProvider

	async create(user: RegisterUser) {
		return this.prisma.user.create({
			data: {
				email: user.email,
				name: user.name,
				password: user.password,
			},
		})
	}

	async findByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email },
		})
	}
}
