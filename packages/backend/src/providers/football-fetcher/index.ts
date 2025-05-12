import { readFile } from 'node:fs/promises'

import { Inject, Injectable, Logger } from '@nestjs/common'
import { getSpainDate } from 'src/utils/date'

import { FixtureResponse, SearchTeamResponse } from './types'

@Injectable()
export default class FootballFetcherProvider {
	@Inject()
	logger: Logger

	private isMocked = process.env.IS_MOCKED === 'true'
	private baseUrl = process.env.API_FOOTBALL_URL || ''
	private teamsPath = process.env.TEAMS_PATH || 'teams'
	private fixturesPath = process.env.FIXTURES_PATH || 'fixtures'
	private season = 2023
	private maxDate = '2023-12-31'
	private timezone = 'Europe/Madrid'

	async searchTeams(teamName: string) {
		try {
			const result = await this.fetch<SearchTeamResponse>(
				this.teamsPath,
				[`search=${teamName}`],
			)
			return result.map(({ team }) => team)
		} catch (error) {
			this.logger.error('Error searching for teams', error)
			throw new Error('Error searching for teams')
		}
	}

	async getFixture(id: number) {
		try {
			const fixtures = await this.fetch<FixtureResponse[]>(
				this.fixturesPath,
				[`id=${id}`],
			)

			return fixtures.map((fixture) => ({
				...fixture,
				league: fixture.league,
				teams: fixture.teams,
			}))[0]
		} catch (error) {
			this.logger.error('Error getting fixture', error)
			throw new Error('Error getting fixture')
		}
	}

	async getFixturesByTeam(teamId: number) {
		try {
			const actualDate = getSpainDate()

			const fixtures = await this.fetch<FixtureResponse[]>(
				this.fixturesPath,
				[
					`season=${this.season}`,
					`from=${actualDate}`,
					`to=${this.maxDate}`,
					`timezone=${this.timezone}`,
					`team=${teamId}`,
				],
			)

			return fixtures.map((fixture) => ({
				...fixture.fixture,
				league: fixture.league,
				teams: fixture.teams,
			}))
		} catch (error) {
			this.logger.error('Error getting fixtures', error)
			throw new Error('Error getting fixtures')
		}
	}

	private async fetch<T>(path: string, parameters: string[]): Promise<T> {
		if (this.isMocked) {
			return this.fetchMock<T>(path)
		}

		const url = new URL(`${this.baseUrl}/${path}`)
		if (parameters.length > 0) {
			url.search = parameters.join('&')
		}

		const response = await fetch(url, {
			headers: {
				'x-rapidapi-host': this.baseUrl,
				'x-rapidapi-key': process.env.API_FOOTBALL_API_KEY || '',
			},
		})

		if (!response.ok) {
			this.logger.error('Error fetching teams', response.statusText)
			throw new Error('Error fetching teams')
		}

		const data = await response.json()

		if (data?.response) {
			return data.response
		}

		return data
	}

	private async fetchMock<T>(path: string): Promise<T> {
		const filePath = `${process.cwd()}/mocks/${path}.json`
		this.logger.log(`Fetching mock data from ${filePath}`)
		const data = await readFile(filePath, 'utf8')
		const result = JSON.parse(data)

		if (result?.response) {
			return result.response as T
		}
		return result
	}
}
