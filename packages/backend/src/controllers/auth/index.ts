import {
	Body,
	Controller,
	Inject,
	Post,
	HttpException,
	HttpStatus,
} from '@nestjs/common'
import { AuthProvider } from 'src/providers'
import type { LoginUser, RegisterUser } from 'src/types'
import {
	InvalidEmailFormatException,
	InvalidPasswordException,
	MissingRequiredFieldsException,
	UserAlreadyExistsException,
	UserNotFoundException,
} from 'src/exceptions/domain/auth'

@Controller('auth')
export default class AuthController {
	@Inject()
	private authProvider: AuthProvider

	@Post('/register')
	async register(@Body() user: RegisterUser) {
		try {
			return await this.authProvider.register(user)
		} catch (error) {
			if (error instanceof UserAlreadyExistsException) {
				throw new HttpException(error.message, HttpStatus.CONFLICT)
			}
			if (
				error instanceof InvalidEmailFormatException ||
				error instanceof MissingRequiredFieldsException
			) {
				throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
			}
			throw error
		}
	}

	@Post('/login')
	async login(@Body() user: LoginUser) {
		try {
			return await this.authProvider.login(user)
		} catch (error) {
			if (
				error instanceof UserNotFoundException ||
				error instanceof InvalidPasswordException
			) {
				throw new HttpException(error.message, HttpStatus.UNAUTHORIZED)
			}
			if (error instanceof MissingRequiredFieldsException) {
				throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
			}
			throw error
		}
	}
}
