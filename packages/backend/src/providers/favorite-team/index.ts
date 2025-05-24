import { Inject, Injectable, Logger } from '@nestjs/common'
import FavoriteTeamRepository from 'src/repositories/team'
import { Team } from 'src/types'
import {
	FavoriteTeamException,
	MaxFavoriteTeamsReachedException,
	InvalidTeamException,
} from 'src/exceptions/domain/favorite-team'

@Injectable()
export default class FavoriteTeamsProvider {
	@Inject()
	favoriteTeamRepository: FavoriteTeamRepository
	@Inject()
	logger: Logger

	async getAllByUser(userId: string) {
		try {
			return this.favoriteTeamRepository.getAllByUser(userId)
		} catch (error) {
			this.logger.error('Error al obtener los equipos favoritos', error)
			throw new FavoriteTeamException(
				'Error al obtener los equipos favoritos',
			)
		}
	}

	async saveFavoriteTeam(userId: string, team: Team) {
		const numberOfTeams = await this.favoriteTeamRepository
			.getNumberOfTeamsByUser(userId)
			.catch((error) => {
				this.logger.error(
					'Error al obtener el número de equipos favoritos',
					error,
				)
				throw new FavoriteTeamException(
					'Error al obtener el número de equipos favoritos',
				)
			})

		if (numberOfTeams >= 5) {
			throw new MaxFavoriteTeamsReachedException()
		}

		if (typeof team.id !== 'number') {
			throw new InvalidTeamException()
		}

		try {
			return this.favoriteTeamRepository.saveFavoriteTeam(userId, team)
		} catch (error) {
			this.logger.error('Error al guardar el equipo favorito', error)
			throw new FavoriteTeamException(
				'Error al guardar el equipo favorito',
			)
		}
	}

	async deleteFavoriteTeam(userId: string, teamId: number) {
		if (typeof teamId !== 'number') {
			throw new InvalidTeamException()
		}

		try {
			return this.favoriteTeamRepository.deleteFavoriteTeam(
				userId,
				teamId,
			)
		} catch (error) {
			this.logger.error('Error al eliminar el equipo favorito', error)
			throw new FavoriteTeamException(
				'Error al eliminar el equipo favorito',
			)
		}
	}
}
