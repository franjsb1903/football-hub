import {
	Controller,
	Get,
	Inject,
	InternalServerErrorException,
	Logger,
	Query,
	UseGuards,
} from '@nestjs/common'
import { AuthGuard } from 'src/guards'
import FootballFetcherProvider from 'src/providers/football-fetcher'
import FavoriteTeamRepository from 'src/repositories/team'
import { Team } from 'src/types'

@Controller('teams')
@UseGuards(AuthGuard)
export default class TeamsController {
	@Inject()
	logger: Logger
	@Inject()
	footballFetcher: FootballFetcherProvider
	@Inject()
	favoriteTeamRepository: FavoriteTeamRepository

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
