import { Test, TestingModule } from '@nestjs/testing'
import { Logger } from '@nestjs/common'
import * as dateUtils from 'src/utils/date'

import FootballFetcherProvider from './index'

jest.mock('node:fs/promises', () => ({
	readFile: jest.fn(),
}))

const mockLogger = {
	error: jest.fn(),
	log: jest.fn(),
}

const mockFetch = jest.fn()
globalThis.fetch = mockFetch as any

describe('FootballFetcherProvider', () => {
	let provider: FootballFetcherProvider

	beforeEach(async () => {
		process.env.API_FOOTBALL_URL = 'http://api'
		process.env.API_FOOTBALL_API_KEY = 'key'
		process.env.TEAMS_PATH = 'teams'
		process.env.FIXTURES_PATH = 'fixtures'
		process.env.IS_MOCKED = 'false'

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				FootballFetcherProvider,
				{ provide: Logger, useValue: mockLogger },
			],
		}).compile()

		provider = module.get(FootballFetcherProvider)
		provider.logger = mockLogger as any
		jest.clearAllMocks()
	})

	describe('searchTeams', () => {
		it('should fetch and return teams', async () => {
			const mockTeams = [{ team: { id: 1, name: 'Team A' } }]
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ response: mockTeams }),
			})

			const result = await provider.searchTeams('Team A')
			expect(result).toEqual([{ id: 1, name: 'Team A' }])
			expect(mockFetch).toHaveBeenCalled()
		})

		it('should fetch and return teams without response body', async () => {
			const mockTeams = [{ team: { id: 1, name: 'Team A' } }]
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => mockTeams,
			})

			const result = await provider.searchTeams('Team A')
			expect(result).toEqual([{ id: 1, name: 'Team A' }])
			expect(mockFetch).toHaveBeenCalled()
		})

		it('should log and throw on error', async () => {
			mockFetch.mockRejectedValueOnce(new Error('fail'))
			await expect(provider.searchTeams('Team A')).rejects.toThrow(
				'Error searching for teams',
			)
			expect(mockLogger.error).toHaveBeenCalledWith(
				'Error searching for teams',
				expect.any(Error),
			)
		})

		it('should log and throw on response not ok', async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
			})
			await expect(provider.searchTeams('Team A')).rejects.toThrow(
				'Error searching for teams',
			)
			expect(mockLogger.error).toHaveBeenCalledWith(
				'Error searching for teams',
				expect.any(Error),
			)
		})
	})

	describe('getTeam', () => {
		it('should fetch and return a team', async () => {
			const mockTeam = [{ id: 2, name: 'Team B' }]
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ response: mockTeam }),
			})

			const result = await provider.getTeam(2)
			expect(result).toEqual({ id: 2, name: 'Team B' })
		})

		it('should log and throw on error', async () => {
			mockFetch.mockRejectedValueOnce(new Error('fail'))
			await expect(provider.getTeam(2)).rejects.toThrow(
				'Error getting team',
			)
			expect(mockLogger.error).toHaveBeenCalledWith(
				'Error getting team',
				expect.any(Error),
			)
		})
	})

	describe('getFixture', () => {
		it('should fetch fixture and rival', async () => {
			const fixtureData = [
				{
					fixture: { id: 1, date: '2023-01-01' },
					league: { id: 10 },
					teams: { home: { id: 1 }, away: { id: 2 } },
					players: [
						{ team: { id: 1 }, players: [{ player: { id: 100 } }] },
					],
				},
			]
			const teamData = [{ id: 2, name: 'Rival' }]
			mockFetch
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({ response: fixtureData }),
				})
				.mockResolvedValueOnce({
					ok: true,
					json: async () => ({ response: teamData }),
				})

			const result = await provider.getFixture(1)
			expect(result.rival).toEqual({ id: 2, name: 'Rival' })
			expect(result.id).toBe(1)
			expect(result.league).toEqual({ id: 10 })
			expect(result.teams.away.id).toBe(2)
		})

		it('should log and throw on error', async () => {
			mockFetch.mockRejectedValueOnce(new Error('fail'))
			await expect(provider.getFixture(1)).rejects.toThrow(
				'Error getting fixture',
			)
			expect(mockLogger.error).toHaveBeenCalledWith(
				'Error getting fixture',
				expect.any(Error),
			)
		})
	})

	describe('getFixturesByTeam', () => {
		it('should fetch, sort and return fixtures', async () => {
			jest.spyOn(dateUtils, 'getSpainDate').mockReturnValue('2023-01-01')
			const fixtureData = [
				{
					fixture: { id: 2, date: '2023-01-02' },
					league: { id: 10 },
					teams: { home: {}, away: {} },
				},
				{
					fixture: { id: 1, date: '2023-01-01' },
					league: { id: 10 },
					teams: { home: {}, away: {} },
				},
			]
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: async () => ({ response: fixtureData }),
			})

			const result = await provider.getFixturesByTeam(1)
			expect(result[0].id).toBe(1)
			expect(result[1].id).toBe(2)
		})

		it('should log and throw on error', async () => {
			mockFetch.mockRejectedValueOnce(new Error('fail'))
			await expect(provider.getFixturesByTeam(1)).rejects.toThrow(
				'Error getting fixtures',
			)
			expect(mockLogger.error).toHaveBeenCalledWith(
				'Error getting fixtures',
				expect.any(Error),
			)
		})
	})
})
