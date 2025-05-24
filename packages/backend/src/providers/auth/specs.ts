/* eslint-disable unicorn/no-null */
import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import PrismaProvider from 'src/database/service'
import UserRepository from 'src/repositories/user'
import {
	InvalidEmailFormatException,
	InvalidPasswordException,
	MissingRequiredFieldsException,
	UserAlreadyExistsException,
	UserNotFoundException,
} from 'src/exceptions/domain'

import AuthProvider from './index'

jest.mock('bcrypt', () => ({
	hash: jest.fn(),
	compare: jest.fn(),
}))

describe('AuthProvider', () => {
	let authProvider: AuthProvider
	let jwtService: JwtService
	let userRepository: UserRepository

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthProvider,
				{
					provide: PrismaProvider,
					useValue: {
						user: {
							findUnique: jest.fn(),
							create: jest.fn(),
						},
					},
				},
				{
					provide: JwtService,
					useValue: {
						sign: jest.fn(),
						verifyAsync: jest.fn(),
					},
				},
				{
					provide: UserRepository,
					useValue: {
						findByEmail: jest.fn(),
						create: jest.fn(),
					},
				},
			],
		}).compile()

		authProvider = module.get<AuthProvider>(AuthProvider)
		jwtService = module.get<JwtService>(JwtService)
		userRepository = module.get<UserRepository>(UserRepository)

		jest.spyOn(authProvider as any, 'hashPassword')
		jest.spyOn(authProvider as any, 'getUserPayloadAndToken')
	})

	it('should be defined', () => {
		expect(authProvider).toBeDefined()
	})

	describe('register', () => {
		const registerUser = {
			email: 'test@example.com',
			name: 'Test User',
			password: 'password123',
		}

		it('should successfully register a user', async () => {
			const hashedPassword = 'hashedpassword'
			const createdUser = {
				id: 1,
				...registerUser,
				password: hashedPassword,
			}

			jest.spyOn(
				authProvider as any,
				'validateUserRegistration',
			).mockResolvedValue(undefined)
			jest.spyOn(authProvider as any, 'hashPassword').mockResolvedValue(
				hashedPassword,
			)
			jest.spyOn(userRepository, 'create').mockResolvedValue(
				createdUser as any,
			)
			jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null)

			const result = await authProvider.register(registerUser)

			expect(
				authProvider['validateUserRegistration'],
			).toHaveBeenCalledWith(registerUser)
			expect(authProvider['hashPassword']).toHaveBeenCalledWith(
				registerUser.password,
			)
			expect(userRepository.create).toHaveBeenCalledWith({
				email: registerUser.email,
				name: registerUser.name,
				password: hashedPassword,
			})
			expect(result).toBe(createdUser)
		})

		it('should throw UserAlreadyExistsException if user with email already exists', async () => {
			const existingUser = {
				email: 'existing@example.com',
				name: 'Existing User',
				password: 'password123',
			}
			jest.spyOn(userRepository, 'findByEmail').mockResolvedValue({
				id: '1',
				...existingUser,
				createdAt: new Date(),
			})

			await expect(authProvider.register(existingUser)).rejects.toThrow(
				UserAlreadyExistsException,
			)
			expect(userRepository.findByEmail).toHaveBeenCalledWith(
				existingUser.email,
			)
		})

		it('should throw MissingRequiredFieldsException if validation fails', async () => {
			const validationError = new MissingRequiredFieldsException()
			jest.spyOn(
				authProvider as any,
				'validateUserRegistration',
			).mockRejectedValue(validationError)

			await expect(authProvider.register(registerUser)).rejects.toThrow(
				MissingRequiredFieldsException,
			)
			expect(
				authProvider['validateUserRegistration'],
			).toHaveBeenCalledWith(registerUser)
		})
	})

	describe('login', () => {
		const loginUser = {
			email: 'test@example.com',
			password: 'password123',
		}
		const savedUser = {
			id: 1,
			email: 'test@example.com',
			name: 'Test User',
			password: 'hashedpassword',
		}
		const userPayload = {
			id: 1,
			email: 'test@example.com',
			name: 'Test User',
		}
		const accessToken = 'mockAccessToken'

		it('should successfully log in a user', async () => {
			jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(
				savedUser as any,
			)
			jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never)
			jest.spyOn(
				authProvider as any,
				'getUserPayloadAndToken',
			).mockReturnValue({ user: userPayload, accessToken })

			const result = await authProvider.login(loginUser)

			expect(userRepository.findByEmail).toHaveBeenCalledWith(
				loginUser.email,
			)
			expect(bcrypt.compare).toHaveBeenCalledWith(
				loginUser.password,
				savedUser.password,
			)
			expect(authProvider['getUserPayloadAndToken']).toHaveBeenCalledWith(
				savedUser,
			)
			expect(result).toEqual({ user: userPayload, accessToken })
		})

		it('should throw MissingRequiredFieldsException if email is missing', async () => {
			await expect(
				authProvider.login({ password: 'password123' } as any),
			).rejects.toThrow(MissingRequiredFieldsException)
			expect(userRepository.findByEmail).not.toHaveBeenCalled()
		})

		it('should throw MissingRequiredFieldsException if password is missing', async () => {
			await expect(
				authProvider.login({ email: 'test@example.com' } as any),
			).rejects.toThrow(MissingRequiredFieldsException)
			expect(userRepository.findByEmail).not.toHaveBeenCalled()
		})

		it('should throw UserNotFoundException if user is not found', async () => {
			jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null)

			await expect(authProvider.login(loginUser)).rejects.toThrow(
				UserNotFoundException,
			)
			expect(userRepository.findByEmail).toHaveBeenCalledWith(
				loginUser.email,
			)
		})

		it('should throw InvalidPasswordException if password is incorrect', async () => {
			jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(
				savedUser as any,
			)
			jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never)

			await expect(authProvider.login(loginUser)).rejects.toThrow(
				InvalidPasswordException,
			)
			expect(userRepository.findByEmail).toHaveBeenCalledWith(
				loginUser.email,
			)
			expect(bcrypt.compare).toHaveBeenCalledWith(
				loginUser.password,
				savedUser.password,
			)
		})
	})

	describe('validateUserRegistration', () => {
		it('should not throw if user registration data is valid', async () => {
			const validUser = {
				email: 'valid@example.com',
				name: 'Valid User',
				password: 'password123',
			}

			await expect(
				(authProvider as any).validateUserRegistration(validUser),
			).resolves.toBeUndefined()
		})

		it('should throw MissingRequiredFieldsException if email is missing', async () => {
			const invalidUser = { name: 'Valid User', password: 'password123' }
			await expect(
				(authProvider as any).validateUserRegistration(invalidUser),
			).rejects.toThrow(MissingRequiredFieldsException)
		})

		it('should throw MissingRequiredFieldsException if name is missing', async () => {
			const invalidUser = {
				email: 'valid@example.com',
				password: 'password123',
			}
			await expect(
				(authProvider as any).validateUserRegistration(invalidUser),
			).rejects.toThrow(MissingRequiredFieldsException)
		})

		it('should throw MissingRequiredFieldsException if password is missing', async () => {
			const invalidUser = {
				email: 'valid@example.com',
				name: 'Valid User',
			}
			await expect(
				(authProvider as any).validateUserRegistration(invalidUser),
			).rejects.toThrow(MissingRequiredFieldsException)
		})

		it('should throw InvalidEmailFormatException if email format is invalid', async () => {
			const invalidUser = {
				email: 'invalid-email',
				name: 'Valid User',
				password: 'password123',
			}
			await expect(
				(authProvider as any).validateUserRegistration(invalidUser),
			).rejects.toThrow(InvalidEmailFormatException)
		})
	})

	describe('hashPassword', () => {
		it('should hash the password', async () => {
			const password = 'password123'
			const hashedPassword = 'hashedpassword'
			;(bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword)

			const result = await (authProvider as any).hashPassword(password)

			expect(bcrypt.hash).toHaveBeenCalledWith(password, 10)
			expect(result).toBe(hashedPassword)
		})
	})

	describe('getUserPayloadAndToken', () => {
		it('should return user payload and access token', () => {
			const user = {
				id: 1,
				email: 'test@example.com',
				name: 'Test User',
				password: 'hashedpassword',
			}
			const expectedPayload = {
				id: 1,
				email: 'test@example.com',
				name: 'Test User',
			}
			const mockToken = 'generatedToken'
			jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken)

			const result = (authProvider as any).getUserPayloadAndToken(user)

			expect(jwtService.sign).toHaveBeenCalledWith(expectedPayload)
			expect(result).toEqual({
				user: expectedPayload,
				accessToken: mockToken,
			})
		})
	})
})
