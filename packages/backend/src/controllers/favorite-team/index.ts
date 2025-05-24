import {
	BadRequestException,
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
	async getAll(@Request() request) {
		const { id: userId } = request.user

		const teams = await this.favoriteTeamProvider.getAllByUser(userId)

		return teams.map((team) => ({
			id: team.teamId,
			code: team.code,
			country: team.country,
			logo: team.teamLogo,
			name: team.name,
		}))
	}

	@Post()
	async saveFavoriteTeam(@Body() team: Team, @Request() request) {
		const { id: userId } = request.user

		if (!team || !team.id) {
			throw new BadRequestException('El equipo no es correcto')
		}

		const result = await this.favoriteTeamProvider.saveFavoriteTeam(
			userId,
			team,
		)
		return result
	}

	@Delete('/:id')
	async deleteFavoriteTeam(@Param('id') teamId: string, @Request() request) {
		const parsedTeamId = Number.parseInt(teamId)
		if (Number.isNaN(parsedTeamId)) {
			throw new BadRequestException('El id del equipo no es correcto')
		}

		const { id: userId } = request.user

		const result = await this.favoriteTeamProvider.deleteFavoriteTeam(
			userId,
			parsedTeamId,
		)
		return result
	}
}
