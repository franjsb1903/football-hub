import { DatabaseService } from 'src/database'
import { Team } from 'src/types'

import FavoriteTeamRepository from './index'

jest.mock('src/database')

describe('FavoriteTeamRepository', () => {
	let repo: FavoriteTeamRepository
	let databaseMock: jest.Mocked<DatabaseService>
	const userId = 'user-1'
	const team: Team = {
		id: 123,
		code: 'FCB',
		country: 'Spain',
		name: 'Barcelona',
		logo: 'logo-url',
	}

	beforeEach(() => {
		databaseMock = {
			favoriteTeam: {
				count: jest.fn(),
				findMany: jest.fn(),
				create: jest.fn(),
				delete: jest.fn(),
			},
		} as any
		repo = new FavoriteTeamRepository()
		// @ts-ignore
		repo.db = databaseMock
	})

	describe('getNumberOfTeamsByUser', () => {
		it('should call db.favoriteTeam.count with correct userId', async () => {
			;(databaseMock.favoriteTeam.count as jest.Mock).mockResolvedValue(2)
			const result = await repo.getNumberOfTeamsByUser(userId)
			expect(databaseMock.favoriteTeam.count).toHaveBeenCalledWith({
				where: { userId },
			})
			expect(result).toBe(2)
		})
	})

	describe('getAllByUser', () => {
		it('should call db.favoriteTeam.findMany with correct userId', async () => {
			const teams = [{}, {}]
			;(
				databaseMock.favoriteTeam.findMany as jest.Mock
			).mockResolvedValue(teams)
			const result = await repo.getAllByUser(userId)
			expect(databaseMock.favoriteTeam.findMany).toHaveBeenCalledWith({
				where: { userId },
			})
			expect(result).toBe(teams)
		})
	})

	describe('saveFavoriteTeam', () => {
		it('should call db.favoriteTeam.create with correct data', async () => {
			const created = { id: 1 }
			;(databaseMock.favoriteTeam.create as jest.Mock).mockResolvedValue(
				created,
			)
			const result = await repo.saveFavoriteTeam(userId, team)
			expect(databaseMock.favoriteTeam.create).toHaveBeenCalledWith({
				data: {
					userId,
					code: team.code,
					country: team.country,
					name: team.name,
					teamId: team.id,
					teamLogo: team.logo,
				},
			})
			expect(result).toBe(created)
		})

		it('should use empty strings for missing team fields', async () => {
			const partialTeam = { id: 2 } as Team
			;(databaseMock.favoriteTeam.create as jest.Mock).mockResolvedValue(
				{},
			)
			await repo.saveFavoriteTeam(userId, partialTeam)
			expect(databaseMock.favoriteTeam.create).toHaveBeenCalledWith({
				data: {
					userId,
					code: '',
					country: '',
					name: '',
					teamId: partialTeam.id,
					teamLogo: '',
				},
			})
		})
	})

	describe('deleteFavoriteTeam', () => {
		it('should call db.favoriteTeam.delete with correct where clause', async () => {
			const deleted = { id: 1 }
			;(databaseMock.favoriteTeam.delete as jest.Mock).mockResolvedValue(
				deleted,
			)
			const result = await repo.deleteFavoriteTeam(userId, team.id)
			expect(databaseMock.favoriteTeam.delete).toHaveBeenCalledWith({
				where: {
					userId_teamId: {
						userId,
						teamId: team.id,
					},
				},
			})
			expect(result).toBe(deleted)
		})
	})
})
