import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ExecutionContext } from '@nestjs/common'

import { AuthGuard } from './index'

describe('AuthGuard', () => {
	let authGuard: AuthGuard
	let jwtService: JwtService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthGuard,
				{
					provide: JwtService,
					useValue: {
						verifyAsync: jest.fn(),
					},
				},
			],
		}).compile()

		authGuard = module.get<AuthGuard>(AuthGuard)
		jwtService = module.get<JwtService>(JwtService)
	})

	it('should be defined', () => {
		expect(authGuard).toBeDefined()
	})

	describe('canActivate', () => {
		let mockExecutionContext: ExecutionContext
		let mockRequest: any

		beforeEach(() => {
			mockRequest = {
				headers: {},
			}
			mockExecutionContext = {
				switchToHttp: () => ({
					getRequest: () => mockRequest,
				}),
			} as ExecutionContext
		})

		it('should throw UnauthorizedException if no token is provided', async () => {
			await expect(
				authGuard.canActivate(mockExecutionContext),
			).rejects.toThrow(UnauthorizedException)
		})

		it('should throw UnauthorizedException if token is invalid', async () => {
			mockRequest.headers.authorization = 'Bearer invalidtoken'
			jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(
				new Error('Invalid token'),
			)

			await expect(
				authGuard.canActivate(mockExecutionContext),
			).rejects.toThrow(UnauthorizedException)
			expect(jwtService.verifyAsync).toHaveBeenCalledWith(
				'invalidtoken',
				{ secret: process.env.JWT_SECRET },
			)
		})

		it('should return true and attach user payload to request if token is valid', async () => {
			const mockPayload = { userId: 123 }
			mockRequest.headers.authorization = 'Bearer validtoken'
			jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(
				mockPayload as any,
			)

			const result = await authGuard.canActivate(mockExecutionContext)
			expect(result).toBe(true)
			expect(jwtService.verifyAsync).toHaveBeenCalledWith('validtoken', {
				secret: process.env.JWT_SECRET,
			})
			expect(mockRequest['user']).toBe(mockPayload)
		})
	})

	describe('extractTokenFromHeader', () => {
		it('should return the token if the header is in "Bearer token" format', () => {
			const request = {
				headers: { authorization: 'Bearer sometoken' },
			} as any
			const token = (authGuard as any).extractTokenFromHeader(request)
			expect(token).toBe('sometoken')
		})

		it('should return undefined if the header is not in "Bearer token" format', () => {
			const request = {
				headers: { authorization: 'Basic sometoken' },
			} as any
			const token = (authGuard as any).extractTokenFromHeader(request)
			expect(token).toBeUndefined()
		})

		it('should return undefined if the authorization header is missing', () => {
			const request = { headers: {} } as any
			const token = (authGuard as any).extractTokenFromHeader(request)
			expect(token).toBeUndefined()
		})
	})
})
