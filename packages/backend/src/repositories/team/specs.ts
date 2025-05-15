import { PrismaProvider } from 'src/providers'
import { Team } from 'src/types'

import FavoriteTeamRepository from './index'

jest.mock('src/providers')

describe('FavoriteTeamRepository', () => {
	let repo: FavoriteTeamRepository
	let prismaMock: jest.Mocked<PrismaProvider>
	const userId = 'user-1'
	const team: Team = {
		id: 123,
		code: 'FCB',
		country: 'Spain',
		name: 'Barcelona',
		logo: 'logo-url',
	}

	beforeEach(() => {
		prismaMock = {
			favoriteTeam: {
				count: jest.fn(),
				findMany: jest.fn(),
				create: jest.fn(),
				delete: jest.fn(),
			},
		} as any
		repo = new FavoriteTeamRepository()
		// @ts-ignore
		repo.prisma = prismaMock
	})

	describe('getNumberOfTeamsByUser', () => {
		it('should call prisma.favoriteTeam.count with correct userId', async () => {
			;(prismaMock.favoriteTeam.count as jest.Mock).mockResolvedValue(2)
			const result = await repo.getNumberOfTeamsByUser(userId)
			expect(prismaMock.favoriteTeam.count).toHaveBeenCalledWith({
				where: { userId },
			})
			expect(result).toBe(2)
		})
	})

	describe('getAllByUser', () => {
		it('should call prisma.favoriteTeam.findMany with correct userId', async () => {
			const teams = [{}, {}]
			;(prismaMock.favoriteTeam.findMany as jest.Mock).mockResolvedValue(
				teams,
			)
			const result = await repo.getAllByUser(userId)
			expect(prismaMock.favoriteTeam.findMany).toHaveBeenCalledWith({
				where: { userId },
			})
			expect(result).toBe(teams)
		})
	})

	describe('saveFavoriteTeam', () => {
		it('should call prisma.favoriteTeam.create with correct data', async () => {
			const created = { id: 1 }
			;(prismaMock.favoriteTeam.create as jest.Mock).mockResolvedValue(
				created,
			)
			const result = await repo.saveFavoriteTeam(userId, team)
			expect(prismaMock.favoriteTeam.create).toHaveBeenCalledWith({
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
			;(prismaMock.favoriteTeam.create as jest.Mock).mockResolvedValue({})
			await repo.saveFavoriteTeam(userId, partialTeam)
			expect(prismaMock.favoriteTeam.create).toHaveBeenCalledWith({
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
		it('should call prisma.favoriteTeam.delete with correct where clause', async () => {
			const deleted = { id: 1 }
			;(prismaMock.favoriteTeam.delete as jest.Mock).mockResolvedValue(
				deleted,
			)
			const result = await repo.deleteFavoriteTeam(userId, team.id)
			expect(prismaMock.favoriteTeam.delete).toHaveBeenCalledWith({
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
