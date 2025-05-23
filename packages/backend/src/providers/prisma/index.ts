import type { OnModuleInit } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export default class PrismaProvider
	extends PrismaClient
	implements OnModuleInit
{
	async onModuleInit() {
		await this.$connect()
	}
}
