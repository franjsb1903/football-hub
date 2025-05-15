import { Test, TestingModule } from '@nestjs/testing'
import { InternalServerErrorException, Logger } from '@nestjs/common'
import { FootballFetcherProvider } from 'src/providers'
import { AuthGuard } from 'src/guards'
import { JwtService } from '@nestjs/jwt'

import FixturesController from './index'

describe('FixturesController', () => {
	let controller: FixturesController
	let footballFetcherProvider: FootballFetcherProvider
	let logger: Logger

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [FixturesController],
			providers: [
				{
					provide: FootballFetcherProvider,
					useValue: {
						getFixture: jest.fn(),
						getFixturesByTeam: jest.fn(),
					},
				},
				{
					provide: Logger,
					useValue: {
						error: jest.fn(),
					},
				},
				{
					provide: AuthGuard,
					useValue: { canActivate: jest.fn(() => true) },
				},
				{
					provide: JwtService,
					useValue: {},
				},
			],
		}).compile()

		controller = module.get<FixturesController>(FixturesController)
		footballFetcherProvider = module.get<FootballFetcherProvider>(
			FootballFetcherProvider,
		)
		logger = module.get<Logger>(Logger)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('getFixture', () => {
		it('should return a fixture when successful', async () => {
			const mockFixture = {
				id: 1,
				rival: {},
				league: {},
				teams: { home: {}, away: {} },
				players: [],
				referee: 'Some Referee',
				date: '2025-01-01',
				venue: {},
				goals: {},
			}
			jest.spyOn(footballFetcherProvider, 'getFixture').mockResolvedValue(
				mockFixture as any, // Use 'as any' for simplicity in mock
			)

			const result = await controller.getFixture(1)
			expect(result).toBe(mockFixture)
			expect(footballFetcherProvider.getFixture).toHaveBeenCalledWith(1)
		})

		it('should throw InternalServerErrorException when an error occurs', async () => {
			const error = new Error('Failed to fetch fixture')
			jest.spyOn(footballFetcherProvider, 'getFixture').mockRejectedValue(
				error,
			)

			await expect(controller.getFixture(1)).rejects.toThrow(
				InternalServerErrorException,
			)
			expect(logger.error).toHaveBeenCalledWith(
				'Error getting fixture 1',
				error,
			)
		})
	})

	describe('getNextTeamFixtures', () => {
		it('should return team fixtures when successful', async () => {
			const mockFixtures = [
				{
					id: 1,
					league: {},
					teams: { home: {}, away: {} },
					referee: 'Some Referee',
					date: '2025-01-01',
					venue: {},
					goals: {},
				},
			]
			jest.spyOn(
				footballFetcherProvider,
				'getFixturesByTeam',
			).mockResolvedValue(mockFixtures as any) // Use 'as any' for simplicity in mock

			const result = await controller.getNextTeamFixtures(10)
			expect(result).toBe(mockFixtures)
			expect(
				footballFetcherProvider.getFixturesByTeam,
			).toHaveBeenCalledWith(10)
		})

		it('should throw InternalServerErrorException when an error occurs', async () => {
			const error = new Error('Failed to fetch team fixtures')
			jest.spyOn(
				footballFetcherProvider,
				'getFixturesByTeam',
			).mockRejectedValue(error)

			await expect(controller.getNextTeamFixtures(10)).rejects.toThrow(
				InternalServerErrorException,
			)
			expect(logger.error).toHaveBeenCalledWith(
				'Error getting fixtures of team 10',
				error,
			)
		})
	})
})
