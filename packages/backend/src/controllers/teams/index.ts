import {
	Body,
	Controller,
	Get,
	Inject,
	InternalServerErrorException,
	Logger,
	Put,
	Query,
	Request,
	UseGuards,
} from '@nestjs/common'
import { AuthGuard } from 'src/guards'
import FootballFetcherProvider from 'src/providers/football-fetcher'
import FavoriteTeamRepository from 'src/repositories/team'
import { Team } from 'src/types'

@Controller('teams')
@UseGuards(AuthGuard)
export class TeamsController {
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

	@Put('/favorite')
	async saveFavoriteTeam(@Body() team: Team, @Request() request) {
		try {
			const user = request.user
			const userId = user.id

			return this.favoriteTeamRepository.saveFavoriteTeam(userId, team)
		} catch (error) {
			this.logger.error('Error saving favorite team', error)
		}
	}
}
