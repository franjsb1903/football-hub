/* eslint-disable unicorn/no-null */
import { Test, TestingModule } from '@nestjs/testing'
import {
	BadRequestException,
	ConflictException,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import AuthProvider from './index'
import PrismaProvider from '../../database/service'

jest.mock('bcrypt', () => ({
	hash: jest.fn(),
	compare: jest.fn(),
}))

describe('AuthProvider', () => {
	let authProvider: AuthProvider
	let prismaProvider: PrismaProvider
	let jwtService: JwtService

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
			],
		}).compile()

		authProvider = module.get<AuthProvider>(AuthProvider)
		prismaProvider = module.get<PrismaProvider>(PrismaProvider)
		jwtService = module.get<JwtService>(JwtService)

		jest.spyOn(authProvider as any, 'hashPassword')
		jest.spyOn(authProvider as any, 'getUserPayloadAndToken')
	})

	it('should be defined', () => {
		expect(authProvider).toBeDefined()
	})

	describe('register', () => {
		const registerUserDto = {
			email: 'test@example.com',
			name: 'Test User',
			password: 'password123',
		}

		it('should successfully register a user', async () => {
			const hashedPassword = 'hashedpassword'
			const createdUser = {
				id: 1,
				...registerUserDto,
				password: hashedPassword,
			}

			jest.spyOn(
				authProvider as any,
				'validateUserRegistration',
			).mockResolvedValue(undefined)
			jest.spyOn(authProvider as any, 'hashPassword').mockResolvedValue(
				hashedPassword,
			)
			jest.spyOn(prismaProvider.user, 'create').mockResolvedValue(
				createdUser as any,
			)

			const result = await authProvider.register(registerUserDto)

			expect(
				authProvider['validateUserRegistration'],
			).toHaveBeenCalledWith(registerUserDto)
			expect(authProvider['hashPassword']).toHaveBeenCalledWith(
				registerUserDto.password,
			)
			expect(prismaProvider.user.create).toHaveBeenCalledWith({
				data: {
					email: registerUserDto.email,
					name: registerUserDto.name,
					password: hashedPassword,
				},
			})
			expect(result).toBe(createdUser)
		})

		it('should throw BadRequestException if validation fails', async () => {
			const validationError = new BadRequestException('Validation failed')
			jest.spyOn(
				authProvider as any,
				'validateUserRegistration',
			).mockRejectedValue(validationError)

			await expect(
				authProvider.register(registerUserDto),
			).rejects.toThrow(BadRequestException)
			expect(
				authProvider['validateUserRegistration'],
			).toHaveBeenCalledWith(registerUserDto)
		})
	})

	describe('login', () => {
		const loginUserDto = {
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
			jest.spyOn(prismaProvider.user, 'findUnique').mockResolvedValue(
				savedUser as any,
			)
			jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never)
			jest.spyOn(
				authProvider as any,
				'getUserPayloadAndToken',
			).mockReturnValue({ user: userPayload, accessToken })

			const result = await authProvider.login(loginUserDto)

			expect(prismaProvider.user.findUnique).toHaveBeenCalledWith({
				where: { email: loginUserDto.email },
			})
			expect(bcrypt.compare).toHaveBeenCalledWith(
				loginUserDto.password,
				savedUser.password,
			)
			expect(authProvider['getUserPayloadAndToken']).toHaveBeenCalledWith(
				savedUser,
			)
			expect(result).toEqual({ user: userPayload, accessToken })
		})

		it('should throw BadRequestException if email is missing', async () => {
			await expect(
				authProvider.login({ password: 'password123' } as any),
			).rejects.toThrow(BadRequestException)
			expect(prismaProvider.user.findUnique).not.toHaveBeenCalled()
		})

		it('should throw BadRequestException if password is missing', async () => {
			await expect(
				authProvider.login({ email: 'test@example.com' } as any),
			).rejects.toThrow(BadRequestException)
			expect(prismaProvider.user.findUnique).not.toHaveBeenCalled()
		})

		it('should throw UnauthorizedException if user is not found', async () => {
			jest.spyOn(prismaProvider.user, 'findUnique').mockResolvedValue(
				null,
			)

			await expect(authProvider.login(loginUserDto)).rejects.toThrow(
				UnauthorizedException,
			)
			expect(prismaProvider.user.findUnique).toHaveBeenCalledWith({
				where: { email: loginUserDto.email },
			})
		})

		it('should throw UnauthorizedException if password is incorrect', async () => {
			jest.spyOn(prismaProvider.user, 'findUnique').mockResolvedValue(
				savedUser as any,
			)
			jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never)

			await expect(authProvider.login(loginUserDto)).rejects.toThrow(
				UnauthorizedException,
			)
			expect(prismaProvider.user.findUnique).toHaveBeenCalledWith({
				where: { email: loginUserDto.email },
			})
			expect(bcrypt.compare).toHaveBeenCalledWith(
				loginUserDto.password,
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
			jest.spyOn(prismaProvider.user, 'findUnique').mockResolvedValue(
				null,
			)

			await expect(
				(authProvider as any).validateUserRegistration(validUser),
			).resolves.toBeUndefined()
			expect(prismaProvider.user.findUnique).toHaveBeenCalledWith({
				where: { email: validUser.email },
			})
		})

		it('should throw BadRequestException if email is missing', async () => {
			const invalidUser = { name: 'Valid User', password: 'password123' }
			await expect(
				(authProvider as any).validateUserRegistration(invalidUser),
			).rejects.toThrow(BadRequestException)
			expect(prismaProvider.user.findUnique).not.toHaveBeenCalled()
		})

		it('should throw BadRequestException if name is missing', async () => {
			const invalidUser = {
				email: 'valid@example.com',
				password: 'password123',
			}
			await expect(
				(authProvider as any).validateUserRegistration(invalidUser),
			).rejects.toThrow(BadRequestException)
			expect(prismaProvider.user.findUnique).not.toHaveBeenCalled()
		})

		it('should throw BadRequestException if password is missing', async () => {
			const invalidUser = {
				email: 'valid@example.com',
				name: 'Valid User',
			}
			await expect(
				(authProvider as any).validateUserRegistration(invalidUser),
			).rejects.toThrow(BadRequestException)
			expect(prismaProvider.user.findUnique).not.toHaveBeenCalled()
		})

		it('should throw BadRequestException if email format is invalid', async () => {
			const invalidUser = {
				email: 'invalid-email',
				name: 'Valid User',
				password: 'password123',
			}
			await expect(
				(authProvider as any).validateUserRegistration(invalidUser),
			).rejects.toThrow(BadRequestException)
			expect(prismaProvider.user.findUnique).not.toHaveBeenCalled()
		})

		it('should throw ConflictException if user with email already exists', async () => {
			const existingUser = {
				email: 'existing@example.com',
				name: 'Existing User',
				password: 'password123',
			}
			jest.spyOn(prismaProvider.user, 'findUnique').mockResolvedValue(
				existingUser as any,
			)

			await expect(
				(authProvider as any).validateUserRegistration(existingUser),
			).rejects.toThrow(ConflictException)
			expect(prismaProvider.user.findUnique).toHaveBeenCalledWith({
				where: { email: existingUser.email },
			})
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
