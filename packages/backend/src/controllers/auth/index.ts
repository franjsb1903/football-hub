import { Body, Controller, Inject, Post } from '@nestjs/common'
import { AuthProvider } from 'src/providers'
import type { LoginUser, RegisterUser } from 'src/types'

@Controller('auth')
export class AuthController {
	@Inject()
	private authProvider: AuthProvider

	@Post('/register')
	async register(@Body() user: RegisterUser) {
		return this.authProvider.register(user)
	}

	@Post('/login')
	async login(@Body() user: LoginUser) {
		return this.authProvider.login(user)
	}
}
