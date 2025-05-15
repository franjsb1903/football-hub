import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Logger,
	Param,
	Post,
	Request,
	UseGuards,
} from '@nestjs/common'
import { AuthGuard } from 'src/guards'
import { FootballFetcherProvider, FavoriteTeamProvider } from 'src/providers'
import { Team } from 'src/types'

@Controller('favorite')
@UseGuards(AuthGuard)
export default class FavoriteTeamController {
	@Inject()
	logger: Logger
	@Inject()
	footballFetcher: FootballFetcherProvider
	@Inject()
	favoriteTeamProvider: FavoriteTeamProvider

	@Get()
	async getAll(@Request() request): Promise<Team[] | undefined> {
		try {
			const user = request.user
			const userId = user.id

			const teams = await this.favoriteTeamProvider.getAllByUser(userId)

			return teams.map((team) => ({
				id: team.teamId,
				code: team.code,
				country: team.country,
				logo: team.teamLogo,
				name: team.name,
			}))
		} catch (error) {
			this.logger.error('Error saving favorite team', error)
		}
	}

	@Post()
	async saveFavoriteTeam(@Body() team: Team, @Request() request) {
		try {
			const user = request.user
			const userId = user.id

			const result = await this.favoriteTeamProvider.saveFavoriteTeam(
				userId,
				team,
			)
			return result
		} catch (error) {
			this.logger.error('Error saving favorite team', error)
		}
	}

	@Delete('/:id')
	async deleteFavoriteTeam(@Param('id') teamId: string, @Request() request) {
		try {
			const user = request.user
			const userId = user.id

			const result = await this.favoriteTeamProvider.deleteFavoriteTeam(
				userId,
				Number.parseInt(teamId),
			)
			return result
		} catch (error) {
			this.logger.error('Error deleting favorite team', error)
		}
	}
}
