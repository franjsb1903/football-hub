/* eslint-disable unicorn/prefer-module */
// eslint-disable-next-line unicorn/import-style
import { join } from 'node:path'

import { Logger, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'

import {
	AuthProvider,
	PrismaProvider,
	FootballFetcherProvider,
	FavoriteTeamProvider,
} from './providers'
import FavoriteTeamRepository from './repositories/team'
import {
	AuthController,
	FavoriteTeamController,
	TeamsController,
} from './controllers'
import FixturesController from './controllers/fixtures'

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
	controllers: [
		AuthController,
		TeamsController,
		FavoriteTeamController,
		FixturesController,
	],
	providers: [
		PrismaProvider,
		AuthProvider,
		FootballFetcherProvider,
		FavoriteTeamRepository,
		FavoriteTeamProvider,
		Logger,
	],
})
export class AppModule {}
