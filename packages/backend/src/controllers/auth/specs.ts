import { Test, TestingModule } from '@nestjs/testing'

import AuthController from './index'
import { AuthProvider } from '../../providers'
import { LoginUser, RegisterUser } from '../../types'

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
	})

	describe('login', () => {
		it('should call authProvider.login with the provided user data', async () => {
			const loginUserDto: LoginUser = {
				email: 'test@example.com',
				password: 'password123',
			}
			const expectedResult = { access_token: 'mock_token' }
			;(authProvider.login as jest.Mock).mockResolvedValue(expectedResult)

			const result = await authController.login(loginUserDto)

			expect(authProvider.login).toHaveBeenCalledWith(loginUserDto)
			expect(result).toBe(expectedResult)
		})
	})
})
