import {
	Controller,
	Get,
	Inject,
	InternalServerErrorException,
	Logger,
	Query,
} from '@nestjs/common'
import FootballFetcherProvider from 'src/providers/football-fetcher'
import { Team } from 'src/types'

@Controller('teams')
export class TeamsController {
	@Inject()
	logger: Logger

	@Inject()
	footballFetcher: FootballFetcherProvider

	@Get()
	async searchTeams(@Query('search') search: string): Promise<Team[]> {
		try {
			const result = await this.footballFetcher.searchTeams(search)
			return result.slice(0, 10)
		} catch (error) {
			this.logger.error('Error searching for teams', error)
			throw new InternalServerErrorException(
				'Ha ocurrido un error al buscar el equipo',
			)
		}
	}
}
