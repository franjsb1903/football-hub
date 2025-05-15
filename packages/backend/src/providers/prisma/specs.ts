import PrismaProvider from './index'

const $connect = jest.fn()

jest.mock('@prisma/client', () => {
	return {
		PrismaClient: jest.fn().mockImplementation(() => ({
			$connect,
			onModuleInit: jest.fn().mockImplementation(() => {
				$connect()
			}),
		})),
	}
})

describe('PrismaProvider', () => {
	let prismaProvider: PrismaProvider

	beforeEach(() => {
		prismaProvider = new PrismaProvider()
	})

	it('should be defined', () => {
		expect(prismaProvider).toBeDefined()
	})

	it('should call $connect on onModuleInit', async () => {
		await prismaProvider.onModuleInit()
		expect(prismaProvider.$connect).toHaveBeenCalled()
	})
})
