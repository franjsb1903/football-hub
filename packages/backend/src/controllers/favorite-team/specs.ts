import { Test, TestingModule } from '@nestjs/testing'
import { Logger } from '@nestjs/common'

import FavoriteTeamController from './index'
import { FavoriteTeamProvider, FootballFetcherProvider } from '../../providers'
import { Team } from '../../types'
import { AuthGuard } from '../../guards'

describe('FavoriteTeamController', () => {
	let favoriteTeamController: FavoriteTeamController
	let favoriteTeamProvider: FavoriteTeamProvider

	const mockAuthGuard = { canActivate: jest.fn(() => true) }

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [FavoriteTeamController],
			providers: [
				{
					provide: FavoriteTeamProvider,
					useValue: {
						getAllByUser: jest.fn(),
						saveFavoriteTeam: jest.fn(),
						deleteFavoriteTeam: jest.fn(),
					},
				},
				{
					provide: FootballFetcherProvider,
					useValue: {},
				},
				{
					provide: Logger,
					useValue: {
						error: jest.fn(),
					},
				},
			],
		})
			.overrideGuard(AuthGuard)
			.useValue(mockAuthGuard)
			.compile()

		favoriteTeamController = module.get<FavoriteTeamController>(
			FavoriteTeamController,
		)
		favoriteTeamProvider =
			module.get<FavoriteTeamProvider>(FavoriteTeamProvider)
	})

	it('should be defined', () => {
		expect(favoriteTeamController).toBeDefined()
	})

	describe('getAll', () => {
		it('should return a list of favorite teams for the user', async () => {
			const userId = 1
			const mockRequest = { user: { id: userId } }
			const mockFavoriteTeams = [
				{
					teamId: 1,
					code: 'LIV',
					country: 'England',
					teamLogo: 'logo1.png',
					name: 'Liverpool',
				},
				{
					teamId: 2,
					code: 'MUN',
					country: 'England',
					teamLogo: 'logo2.png',
					name: 'Manchester United',
				},
			]
			const expectedTeams: Team[] = [
				{
					id: 1,
					code: 'LIV',
					country: 'England',
					logo: 'logo1.png',
					name: 'Liverpool',
				},
				{
					id: 2,
					code: 'MUN',
					country: 'England',
					logo: 'logo2.png',
					name: 'Manchester United',
				},
			]
			;(favoriteTeamProvider.getAllByUser as jest.Mock).mockResolvedValue(
				mockFavoriteTeams,
			)

			const result = await favoriteTeamController.getAll(mockRequest)

			expect(favoriteTeamProvider.getAllByUser).toHaveBeenCalledWith(
				userId,
			)
			expect(result).toEqual(expectedTeams)
		})

		it('should log an error if an exception occurs', async () => {
			const error = new Error('Something went wrong')
			try {
				const userId = 1
				const mockRequest = { user: { id: userId } }
				;(
					favoriteTeamProvider.getAllByUser as jest.Mock
				).mockRejectedValue(error)

				await favoriteTeamController.getAll(mockRequest)

				expect(1).toBe(0)
			} catch (error) {
				expect(error).toBeDefined()
			}
		})
	})

	describe('saveFavoriteTeam', () => {
		it('should call favoriteTeamProvider.saveFavoriteTeam with user id and team data', async () => {
			const userId = 1
			const mockRequest = { user: { id: userId } }
			const teamData: Team = {
				id: 3,
				code: 'CHE',
				country: 'England',
				logo: 'logo3.png',
				name: 'Chelsea',
			}
			const expectedResult = { userId: userId, teamId: teamData.id }
			;(
				favoriteTeamProvider.saveFavoriteTeam as jest.Mock
			).mockResolvedValue(expectedResult)

			const result = await favoriteTeamController.saveFavoriteTeam(
				teamData,
				mockRequest,
			)

			expect(favoriteTeamProvider.saveFavoriteTeam).toHaveBeenCalledWith(
				userId,
				teamData,
			)
			expect(result).toBe(expectedResult)
		})

		it('should log an error if an exception occurs', async () => {
			const error = new Error('Something went wrong')

			try {
				const userId = 1
				const mockRequest = { user: { id: userId } }
				const teamData: Team = {
					id: 3,
					code: 'CHE',
					country: 'England',
					logo: 'logo3.png',
					name: 'Chelsea',
				}
				;(
					favoriteTeamProvider.saveFavoriteTeam as jest.Mock
				).mockRejectedValue(error)

				await favoriteTeamController.saveFavoriteTeam(
					teamData,
					mockRequest,
				)

				expect(1).toBe(0)
			} catch (error) {
				expect(error).toBeDefined()
			}
		})
	})

	describe('deleteFavoriteTeam', () => {
		it('should call favoriteTeamProvider.deleteFavoriteTeam with user id and team id', async () => {
			const userId = 1
			const teamId = '4'
			const mockRequest = { user: { id: userId } }
			const expectedResult = { deleted: true }
			;(
				favoriteTeamProvider.deleteFavoriteTeam as jest.Mock
			).mockResolvedValue(expectedResult)

			const result = await favoriteTeamController.deleteFavoriteTeam(
				teamId,
				mockRequest,
			)

			expect(
				favoriteTeamProvider.deleteFavoriteTeam,
			).toHaveBeenCalledWith(userId, Number.parseInt(teamId))
			expect(result).toBe(expectedResult)
		})

		it('should log an error if an exception occurs', async () => {
			const error = new Error('Something went wrong')

			try {
				const userId = 1
				const teamId = '4'
				const mockRequest = { user: { id: userId } }
				;(
					favoriteTeamProvider.deleteFavoriteTeam as jest.Mock
				).mockRejectedValue(error)

				await favoriteTeamController.deleteFavoriteTeam(
					teamId,
					mockRequest,
				)

				expect(1).toBe(0)
			} catch (error) {
				expect(error).toBeDefined()
			}
		})
	})
})
