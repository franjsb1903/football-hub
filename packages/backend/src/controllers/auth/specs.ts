import { Test, TestingModule } from '@nestjs/testing'
import { HttpException, HttpStatus } from '@nestjs/common'
import { AuthProvider } from 'src/providers'
import { LoginUser, RegisterUser } from 'src/types'
import {
	InvalidEmailFormatException,
	InvalidPasswordException,
	MissingRequiredFieldsException,
	UserAlreadyExistsException,
	UserNotFoundException,
} from 'src/exceptions/domain'

import AuthController from './index'

describe('AuthController', () => {
	let authController: AuthController
	let authProvider: AuthProvider

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthProvider,
					useValue: {
						register: jest.fn(),
						login: jest.fn(),
					},
				},
			],
		}).compile()

		authController = module.get<AuthController>(AuthController)
		authProvider = module.get<AuthProvider>(AuthProvider)
	})

	it('should be defined', () => {
		expect(authController).toBeDefined()
	})

	describe('register', () => {
		it('should call authProvider.register with the provided user data', async () => {
			const registerUserDto: RegisterUser = {
				email: 'test@example.com',
				password: 'password123',
				name: 'Test User',
			}
			const expectedResult = { id: 1, ...registerUserDto }
			;(authProvider.register as jest.Mock).mockResolvedValue(
				expectedResult,
			)

			const result = await authController.register(registerUserDto)

			expect(authProvider.register).toHaveBeenCalledWith(registerUserDto)
			expect(result).toBe(expectedResult)
		})

		it('should map UserAlreadyExistsException to CONFLICT status', async () => {
			const registerUserDto: RegisterUser = {
				email: 'test@example.com',
				password: 'password123',
				name: 'Test User',
			}
			;(authProvider.register as jest.Mock).mockRejectedValue(
				new UserAlreadyExistsException(),
			)

			await expect(
				authController.register(registerUserDto),
			).rejects.toThrow(HttpException)
			await expect(
				authController.register(registerUserDto),
			).rejects.toMatchObject({
				status: HttpStatus.CONFLICT,
				message: 'Ya existe un usuario con ese email',
			})
		})

		it('should map InvalidEmailFormatException to BAD_REQUEST status', async () => {
			const registerUserDto: RegisterUser = {
				email: 'invalid-email',
				password: 'password123',
				name: 'Test User',
			}
			;(authProvider.register as jest.Mock).mockRejectedValue(
				new InvalidEmailFormatException(),
			)

			await expect(
				authController.register(registerUserDto),
			).rejects.toThrow(HttpException)
			await expect(
				authController.register(registerUserDto),
			).rejects.toMatchObject({
				status: HttpStatus.BAD_REQUEST,
				message: 'El formato del email no es válido',
			})
		})

		it('should map MissingRequiredFieldsException to BAD_REQUEST status', async () => {
			const registerUserDto = {
				email: 'test@example.com',
				// Missing required fields
			} as RegisterUser
			;(authProvider.register as jest.Mock).mockRejectedValue(
				new MissingRequiredFieldsException(),
			)

			await expect(
				authController.register(registerUserDto),
			).rejects.toThrow(HttpException)
			await expect(
				authController.register(registerUserDto),
			).rejects.toMatchObject({
				status: HttpStatus.BAD_REQUEST,
				message: 'Faltan campos requeridos',
			})
		})
	})

	describe('login', () => {
		it('should call authProvider.login with the provided user data', async () => {
			const loginUserDto: LoginUser = {
				email: 'test@example.com',
				password: 'password123',
			}
			const expectedResult = {
				user: { id: 1, email: 'test@example.com', name: 'Test User' },
				accessToken: 'mock_token',
			}
			;(authProvider.login as jest.Mock).mockResolvedValue(expectedResult)

			const result = await authController.login(loginUserDto)

			expect(authProvider.login).toHaveBeenCalledWith(loginUserDto)
			expect(result).toBe(expectedResult)
		})

		it('should map UserNotFoundException to UNAUTHORIZED status', async () => {
			const loginUserDto: LoginUser = {
				email: 'test@example.com',
				password: 'password123',
			}
			;(authProvider.login as jest.Mock).mockRejectedValue(
				new UserNotFoundException(),
			)

			await expect(authController.login(loginUserDto)).rejects.toThrow(
				HttpException,
			)
			await expect(
				authController.login(loginUserDto),
			).rejects.toMatchObject({
				status: HttpStatus.UNAUTHORIZED,
				message: 'Usuario no encontrado',
			})
		})

		it('should map InvalidPasswordException to UNAUTHORIZED status', async () => {
			const loginUserDto: LoginUser = {
				email: 'test@example.com',
				password: 'wrong-password',
			}
			;(authProvider.login as jest.Mock).mockRejectedValue(
				new InvalidPasswordException(),
			)

			await expect(authController.login(loginUserDto)).rejects.toThrow(
				HttpException,
			)
			await expect(
				authController.login(loginUserDto),
			).rejects.toMatchObject({
				status: HttpStatus.UNAUTHORIZED,
				message: 'Contraseña incorrecta',
			})
		})

		it('should map MissingRequiredFieldsException to BAD_REQUEST status', async () => {
			const loginUserDto = {
				email: 'test@example.com',
				// Missing password
			} as LoginUser
			;(authProvider.login as jest.Mock).mockRejectedValue(
				new MissingRequiredFieldsException(),
			)

			await expect(authController.login(loginUserDto)).rejects.toThrow(
				HttpException,
			)
			await expect(
				authController.login(loginUserDto),
			).rejects.toMatchObject({
				status: HttpStatus.BAD_REQUEST,
				message: 'Faltan campos requeridos',
			})
		})
	})
})
