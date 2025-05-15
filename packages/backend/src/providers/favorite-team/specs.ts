import { BadRequestException } from '@nestjs/common'

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

		it('should throw if user already has 5 teams', async () => {
			mockFavoriteTeamRepository.getNumberOfTeamsByUser.mockResolvedValue(
				5,
			)
			const provider = createProvider()
			await expect(
				provider.saveFavoriteTeam(userId, team as any),
			).rejects.toThrow(BadRequestException)
		})

		it('should throw if team id is not a number', async () => {
			mockFavoriteTeamRepository.getNumberOfTeamsByUser.mockResolvedValue(
				2,
			)
			const provider = createProvider()
			await expect(
				provider.saveFavoriteTeam(userId, { id: 'abc' } as any),
			).rejects.toThrow(BadRequestException)
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

		it('should throw if team id is not a number', async () => {
			const provider = createProvider()
			await expect(
				provider.deleteFavoriteTeam(userId, 'abc' as any),
			).rejects.toThrow(BadRequestException)
		})
	})
})
