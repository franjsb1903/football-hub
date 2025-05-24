import { Test, TestingModule } from '@nestjs/testing'
import { Logger, BadRequestException } from '@nestjs/common'

import FavoriteTeamController from './index'
import { FavoriteTeamProvider, FootballFetcherProvider } from '../../providers'
import { Team } from '../../types'
import { AuthGuard } from '../../guards'
import {
	FavoriteTeamException,
	MaxFavoriteTeamsReachedException,
	InvalidTeamException,
} from '../../exceptions/domain/favorite-team'

describe('FavoriteTeamController', () => {
	let favoriteTeamController: FavoriteTeamController
	let favoriteTeamProvider: FavoriteTeamProvider
	let logger: Logger

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
		logger = module.get<Logger>(Logger)
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

		it('should transform FavoriteTeamException to BadRequestException', async () => {
			const userId = 1
			const mockRequest = { user: { id: userId } }
			const error = new FavoriteTeamException(
				'Error al obtener los equipos favoritos',
			)
			;(favoriteTeamProvider.getAllByUser as jest.Mock).mockRejectedValue(
				error,
			)

			await expect(
				favoriteTeamController.getAll(mockRequest),
			).rejects.toThrow(BadRequestException)
			expect(logger.error).toHaveBeenCalled()
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
			).mockResolvedValueOnce(expectedResult)

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

		it('should transform MaxFavoriteTeamsReachedException to BadRequestException', async () => {
			const userId = 1
			const mockRequest = { user: { id: userId } }
			const teamData: Team = {
				id: 3,
				code: 'CHE',
				country: 'England',
				logo: 'logo3.png',
				name: 'Chelsea',
			}
			const error = new MaxFavoriteTeamsReachedException()
			;(
				favoriteTeamProvider.saveFavoriteTeam as jest.Mock
			).mockRejectedValue(error)

			await expect(
				favoriteTeamController.saveFavoriteTeam(teamData, mockRequest),
			).rejects.toThrow(BadRequestException)
			expect(logger.error).toHaveBeenCalled()
		})

		it('should transform InvalidTeamException to BadRequestException', async () => {
			const userId = 1
			const mockRequest = { user: { id: userId } }
			const teamData: Team = {
				id: 3,
				code: 'CHE',
				country: 'England',
				logo: 'logo3.png',
				name: 'Chelsea',
			}
			const error = new InvalidTeamException()
			;(
				favoriteTeamProvider.saveFavoriteTeam as jest.Mock
			).mockRejectedValue(error)

			await expect(
				favoriteTeamController.saveFavoriteTeam(teamData, mockRequest),
			).rejects.toThrow(BadRequestException)
			expect(logger.error).toHaveBeenCalled()
		})

		it('should transform FavoriteTeamException to BadRequestException', async () => {
			const userId = 1
			const mockRequest = { user: { id: userId } }
			const teamData: Team = {
				id: 3,
				code: 'CHE',
				country: 'England',
				logo: 'logo3.png',
				name: 'Chelsea',
			}
			const error = new FavoriteTeamException(
				'Error al guardar el equipo favorito',
			)
			;(
				favoriteTeamProvider.saveFavoriteTeam as jest.Mock
			).mockRejectedValue(error)

			await expect(
				favoriteTeamController.saveFavoriteTeam(teamData, mockRequest),
			).rejects.toThrow(BadRequestException)
			expect(logger.error).toHaveBeenCalled()
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

		it('should transform InvalidTeamException to BadRequestException', async () => {
			const userId = 1
			const teamId = '4'
			const mockRequest = { user: { id: userId } }
			const error = new InvalidTeamException()
			;(
				favoriteTeamProvider.deleteFavoriteTeam as jest.Mock
			).mockRejectedValue(error)

			await expect(
				favoriteTeamController.deleteFavoriteTeam(teamId, mockRequest),
			).rejects.toThrow(BadRequestException)
			expect(logger.error).toHaveBeenCalled()
		})

		it('should transform FavoriteTeamException to BadRequestException', async () => {
			const userId = 1
			const teamId = '4'
			const mockRequest = { user: { id: userId } }
			const error = new FavoriteTeamException(
				'Error al eliminar el equipo favorito',
			)
			;(
				favoriteTeamProvider.deleteFavoriteTeam as jest.Mock
			).mockRejectedValue(error)

			await expect(
				favoriteTeamController.deleteFavoriteTeam(teamId, mockRequest),
			).rejects.toThrow(BadRequestException)
			expect(logger.error).toHaveBeenCalled()
		})
	})
})
