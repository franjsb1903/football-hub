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
import {
	FavoriteTeamException,
	MaxFavoriteTeamsReachedException,
	InvalidTeamException,
} from 'src/exceptions/domain/favorite-team'

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
		try {
			const { id: userId } = request.user
			const teams = await this.favoriteTeamProvider.getAllByUser(userId)

			return teams.map((team) => ({
				id: team.teamId,
				code: team.code,
				country: team.country,
				logo: team.teamLogo,
				name: team.name,
			}))
		} catch (error) {
			if (error instanceof FavoriteTeamException) {
				this.logger.error(
					'Error al obtener los equipos favoritos',
					error,
				)
				throw new BadRequestException(error.message)
			}
			throw error
		}
	}

	@Post()
	async saveFavoriteTeam(@Body() team: Team, @Request() request) {
		try {
			const { id: userId } = request.user

			if (!team || !team.id) {
				throw new InvalidTeamException()
			}

			const result = await this.favoriteTeamProvider.saveFavoriteTeam(
				userId,
				team,
			)
			return result
		} catch (error) {
			if (error instanceof MaxFavoriteTeamsReachedException) {
				this.logger.error('Error al guardar el equipo favorito', error)
				throw new BadRequestException(error.message)
			}
			if (error instanceof InvalidTeamException) {
				this.logger.error('Error al guardar el equipo favorito', error)
				throw new BadRequestException(error.message)
			}
			if (error instanceof FavoriteTeamException) {
				this.logger.error('Error al guardar el equipo favorito', error)
				throw new BadRequestException(error.message)
			}
			throw error
		}
	}

	@Delete('/:id')
	async deleteFavoriteTeam(@Param('id') teamId: string, @Request() request) {
		try {
			const parsedTeamId = Number.parseInt(teamId)
			if (Number.isNaN(parsedTeamId)) {
				throw new InvalidTeamException()
			}

			const { id: userId } = request.user

			const result = await this.favoriteTeamProvider.deleteFavoriteTeam(
				userId,
				parsedTeamId,
			)
			return result
		} catch (error) {
			if (error instanceof InvalidTeamException) {
				this.logger.error('Error al eliminar el equipo favorito', error)
				throw new BadRequestException(error.message)
			}
			if (error instanceof FavoriteTeamException) {
				this.logger.error('Error al eliminar el equipo favorito', error)
				throw new BadRequestException(error.message)
			}
			throw error
		}
	}
}
