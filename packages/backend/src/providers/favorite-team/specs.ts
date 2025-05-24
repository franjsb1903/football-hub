import {
	FavoriteTeamException,
	MaxFavoriteTeamsReachedException,
	InvalidTeamException,
} from 'src/exceptions/domain/favorite-team'

import FavoriteTeamsProvider from './index'

const mockFavoriteTeamRepository = {
	getAllByUser: jest.fn(),
	getNumberOfTeamsByUser: jest.fn(),
	saveFavoriteTeam: jest.fn(),
	deleteFavoriteTeam: jest.fn(),
}

function createProvider() {
	const provider = new FavoriteTeamsProvider()
	// @ts-ignore
	provider.favoriteTeamRepository = mockFavoriteTeamRepository
	// @ts-ignore
	provider.logger = { error: jest.fn() }
	return provider
}

describe('FavoriteTeamsProvider', () => {
	const userId = 'user-1'
	const team = { id: 1, name: 'Team A' }

	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe('getAllByUser', () => {
		it('should call repository and return teams', async () => {
			mockFavoriteTeamRepository.getAllByUser.mockResolvedValue(['team1'])
			const provider = createProvider()
			const result = await provider.getAllByUser(userId)
			expect(
				mockFavoriteTeamRepository.getAllByUser,
			).toHaveBeenCalledWith(userId)
			expect(result).toEqual(['team1'])
		})

		it('should transform repository error to FavoriteTeamException', async () => {
			const databaseError = new Error('DB Error')
			mockFavoriteTeamRepository.getAllByUser.mockRejectedValue(
				databaseError,
			)
			const provider = createProvider()

			await expect(provider.getAllByUser(userId)).rejects.toThrow(
				FavoriteTeamException,
			)
			expect(provider.logger.error).toHaveBeenCalledWith(
				'Error al obtener los equipos favoritos',
				databaseError,
			)
		})
	})

	describe('saveFavoriteTeam', () => {
		it('should save team if under limit and id is number', async () => {
			mockFavoriteTeamRepository.getNumberOfTeamsByUser.mockResolvedValue(
				3,
			)
			mockFavoriteTeamRepository.saveFavoriteTeam.mockResolvedValue(
				'saved',
			)
			const provider = createProvider()
			const result = await provider.saveFavoriteTeam(userId, team as any)
			expect(
				mockFavoriteTeamRepository.saveFavoriteTeam,
			).toHaveBeenCalledWith(userId, team)
			expect(result).toBe('saved')
		})

		it('should throw MaxFavoriteTeamsReachedException if user already has 5 teams', async () => {
			mockFavoriteTeamRepository.getNumberOfTeamsByUser.mockResolvedValue(
				5,
			)
			const provider = createProvider()
			await expect(
				provider.saveFavoriteTeam(userId, team as any),
			).rejects.toThrow(MaxFavoriteTeamsReachedException)
		})

		it('should throw InvalidTeamException if team id is not a number', async () => {
			mockFavoriteTeamRepository.getNumberOfTeamsByUser.mockResolvedValue(
				2,
			)
			const provider = createProvider()
			await expect(
				provider.saveFavoriteTeam(userId, { id: 'abc' } as any),
			).rejects.toThrow(InvalidTeamException)
		})

		it('should transform repository error to FavoriteTeamException', async () => {
			const databaseError = new Error('DB Error')
			mockFavoriteTeamRepository.getNumberOfTeamsByUser.mockResolvedValue(
				2,
			)
			mockFavoriteTeamRepository.saveFavoriteTeam.mockRejectedValue(
				databaseError,
			)
			const provider = createProvider()

			await expect(
				provider.saveFavoriteTeam(userId, team as any),
			).rejects.toThrow(FavoriteTeamException)
			expect(provider.logger.error).toHaveBeenCalledWith(
				'Error al guardar el equipo favorito',
				databaseError,
			)
		})
	})

	describe('deleteFavoriteTeam', () => {
		it('should delete team if id is number', async () => {
			mockFavoriteTeamRepository.deleteFavoriteTeam.mockResolvedValue(
				'deleted',
			)
			const provider = createProvider()
			const result = await provider.deleteFavoriteTeam(userId, 1)
			expect(
				mockFavoriteTeamRepository.deleteFavoriteTeam,
			).toHaveBeenCalledWith(userId, 1)
			expect(result).toBe('deleted')
		})

		it('should throw InvalidTeamException if team id is not a number', async () => {
			const provider = createProvider()
			await expect(
				provider.deleteFavoriteTeam(userId, 'abc' as any),
			).rejects.toThrow(InvalidTeamException)
		})

		it('should transform repository error to FavoriteTeamException', async () => {
			const databaseError = new Error('DB Error')
			mockFavoriteTeamRepository.deleteFavoriteTeam.mockRejectedValue(
				databaseError,
			)
			const provider = createProvider()

			await expect(
				provider.deleteFavoriteTeam(userId, 1),
			).rejects.toThrow(FavoriteTeamException)
			expect(provider.logger.error).toHaveBeenCalledWith(
				'Error al eliminar el equipo favorito',
				databaseError,
			)
		})
	})
})
