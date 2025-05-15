import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	// eslint-disable-next-line unicorn/prevent-abbreviations
	use(request: Request, res: Response, next: NextFunction) {
		const { method, originalUrl, ip } = request
		console.log(
			`[${new Date().toISOString()}] ${method} ${originalUrl} ${ip}`,
		)

		next()
	}
}
