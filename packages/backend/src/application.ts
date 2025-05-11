/* eslint-disable unicorn/prefer-module */
// eslint-disable-next-line unicorn/import-style
import { join } from 'node:path'

import { Logger, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'

import { AuthController } from './controllers/auth'
import { AuthProvider, PrismaProvider } from './providers'
import { TeamsController } from './controllers/teams'
import FootballFetcherProvider from './providers/football-fetcher'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [
				join(__dirname, '..', '.env'),
				join(__dirname, '..', '..', '..', '.env'),
			],
			isGlobal: true,
		}),
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
		}),
	],
	controllers: [AuthController, TeamsController],
	providers: [PrismaProvider, AuthProvider, FootballFetcherProvider, Logger],
})
export class AppModule {}
