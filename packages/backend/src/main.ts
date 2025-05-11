import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'

import { AppModule } from './application'

const CORS_ORIGINS = process.env.CORS_ORIGINS?.split(',') || []

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.setGlobalPrefix('api')
	app.enableCors({
		origin: CORS_ORIGINS,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		allowedHeaders: 'Content-Type, Accept, Authorization',
	})
	const port = process.env.PORT ?? 3000
	await app.listen(port)
	app.enableShutdownHooks()

	const logger = new Logger()
	logger.log(`Application is running on: ${await app.getUrl()}`)
}
// eslint-disable-next-line unicorn/prefer-top-level-await
bootstrap()
