import {
	Body,
	Controller,
	Delete,
	Inject,
	Logger,
	Param,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common'
import { AuthGuard } from 'src/guards'
import FootballFetcherProvider from 'src/providers/football-fetcher'
import FavoriteTeamRepository from 'src/repositories/team'
import { Team } from 'src/types'

@Controller('favorite')
@UseGuards(AuthGuard)
export default class FavoriteTeamsController {
	@Inject()
	logger: Logger
	@Inject()
	footballFetcher: FootballFetcherProvider
	@Inject()
	favoriteTeamRepository: FavoriteTeamRepository

	@Post('')
	async saveFavoriteTeam(@Body() team: Team, @Request() request) {
		try {
			const user = request.user
			const userId = user.id

			return this.favoriteTeamRepository.saveFavoriteTeam(userId, team)
		} catch (error) {
			this.logger.error('Error saving favorite team', error)
		}
	}

	@Delete('/:id')
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
