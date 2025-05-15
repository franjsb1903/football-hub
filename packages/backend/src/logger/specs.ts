import { Request, Response, NextFunction } from 'express'

import { LoggerMiddleware } from './index'

describe('LoggerMiddleware', () => {
	let loggerMiddleware: LoggerMiddleware
	let mockRequest: Partial<Request>
	let mockResponse: Partial<Response>
	let nextFunction: NextFunction
	let consoleSpy: jest.SpyInstance

	beforeEach(() => {
		loggerMiddleware = new LoggerMiddleware()
		mockRequest = {
			method: 'GET',
			originalUrl: '/test',
			ip: '127.0.0.1',
		}
		mockResponse = {}
		nextFunction = jest.fn()
		consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
	})

	afterEach(() => {
		consoleSpy.mockRestore()
	})

	it('should be defined', () => {
		expect(loggerMiddleware).toBeDefined()
	})

	it('should log the request details and call next', () => {
		const date = new Date()
		jest.spyOn(globalThis, 'Date').mockImplementation(() => date as any)

		loggerMiddleware.use(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction,
		)

		expect(consoleSpy).toHaveBeenCalledWith(
			`[${date.toISOString()}] ${mockRequest.method} ${mockRequest.originalUrl} ${mockRequest.ip}`,
		)
		expect(nextFunction).toHaveBeenCalledTimes(1)
	})
})
