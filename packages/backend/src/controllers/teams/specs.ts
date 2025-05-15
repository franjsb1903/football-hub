import { Test, TestingModule } from '@nestjs/testing'
import { InternalServerErrorException, Logger } from '@nestjs/common'
import FootballFetcherProvider from 'src/providers/football-fetcher'
import FavoriteTeamRepository from 'src/repositories/team'
import { AuthGuard } from 'src/guards'
import { JwtService } from '@nestjs/jwt'

import TeamsController from './index'

describe('TeamsController', () => {
	let controller: TeamsController
	let footballFetcherProvider: FootballFetcherProvider
	let logger: Logger

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TeamsController],
			providers: [
				{
					provide: FootballFetcherProvider,
					useValue: {
						searchTeams: jest.fn(),
					},
				},
				{
					provide: Logger,
					useValue: {
						error: jest.fn(),
					},
				},
				{
					provide: FavoriteTeamRepository,
					useValue: {},
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

		controller = module.get<TeamsController>(TeamsController)
		footballFetcherProvider = module.get<FootballFetcherProvider>(
			FootballFetcherProvider,
		)
		logger = module.get<Logger>(Logger)
		logger = module.get<Logger>(Logger)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})

	describe('searchTeams', () => {
		it('should return a list of teams when successful', async () => {
			const mockTeams = [
				{ id: 1, name: 'Team 1' },
				{ id: 2, name: 'Team 2' },
			]
			jest.spyOn(
				footballFetcherProvider,
				'searchTeams',
			).mockResolvedValue(mockTeams as any)

			const result = await controller.searchTeams('test')
			expect(result).toEqual(mockTeams)
			expect(footballFetcherProvider.searchTeams).toHaveBeenCalledWith(
				'test',
			)
		})

		it('should return a maximum of 10 teams', async () => {
			const mockTeams = Array.from({ length: 15 }, (_, index) => ({
				id: index + 1,
				name: `Team ${index + 1}`,
			}))
			jest.spyOn(
				footballFetcherProvider,
				'searchTeams',
			).mockResolvedValue(mockTeams as any)

			const result = await controller.searchTeams('test')
			expect(result.length).toBe(10)
			expect(footballFetcherProvider.searchTeams).toHaveBeenCalledWith(
				'test',
			)
		})

		it('should throw InternalServerErrorException when an error occurs', async () => {
			const error = new Error('Failed to search teams')
			jest.spyOn(
				footballFetcherProvider,
				'searchTeams',
			).mockRejectedValue(error)

			await expect(controller.searchTeams('test')).rejects.toThrow(
				InternalServerErrorException,
			)
			expect(logger.error).toHaveBeenCalledWith(
				'Error searching for teams',
				error,
			)
		})
	})
})
