import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	InternalServerErrorException,
	Logger,
	Param,
	Post,
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

	@Post('/favorite')
	async saveFavoriteTeam(@Body() team: Team, @Request() request) {
		try {
			const user = request.user
			const userId = user.id

			return this.favoriteTeamRepository.saveFavoriteTeam(userId, team)
		} catch (error) {
			this.logger.error('Error saving favorite team', error)
		}
	}

	@Delete('/favorite/:id')
	async deleteFavoriteTeam(@Param('id') teamId: string, @Request() request) {
		try {
			const user = request.user
			const userId = user.id

			return this.favoriteTeamRepository.deleteFavoriteTeam(
				userId,
				Number.parseInt(teamId),
			)
		} catch (error) {
			this.logger.error('Error deleting favorite team', error)
		}
	}
}
