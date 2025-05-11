import { readFile } from 'node:fs/promises'

import { Inject, Injectable, Logger } from '@nestjs/common'

import { SearchTeamResponse } from './types'

@Injectable()
export default class FootballFetcherProvider {
	@Inject()
	logger: Logger

	private isMocked = process.env.IS_MOCKED === 'true'
	private baseUrl = process.env.API_FOOTBALL_URL || ''
	private teamsPath = process.env.TEAMS_PATH || 'teams'

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
