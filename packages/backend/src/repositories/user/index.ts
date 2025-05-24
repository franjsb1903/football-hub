import { Inject, Injectable } from '@nestjs/common'
import { RegisterUser } from 'src/types'
import { DatabaseService } from 'src/database'

@Injectable()
export default class UserRepository {
	@Inject()
	db: DatabaseService

	async create(user: RegisterUser) {
		return this.db.user.create({
			data: {
				email: user.email,
				name: user.name,
				password: user.password,
			},
		})
	}

	async findByEmail(email: string) {
		return this.db.user.findUnique({
			where: { email },
		})
	}
}
