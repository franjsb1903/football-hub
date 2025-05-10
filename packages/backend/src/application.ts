import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { AuthController } from './controllers/auth'
import { AuthProvider, PrismaProvider } from './providers'

@Module({
	imports: [
		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
		}),
	],
	controllers: [AuthController],
	providers: [PrismaProvider, AuthProvider],
})
export class AppModule {}
