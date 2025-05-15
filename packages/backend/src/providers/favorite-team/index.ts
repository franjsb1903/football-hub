import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import FavoriteTeamRepository from 'src/repositories/team'
import { Team } from 'src/types'

@Injectable()
export default class FavoriteTeamsProvider {
	@Inject()
	favoriteTeamRepository: FavoriteTeamRepository

	async getAllByUser(userId: string) {
		return this.favoriteTeamRepository.getAllByUser(userId)
	}

	async saveFavoriteTeam(userId: string, team: Team) {
		const numberOfTeams =
			await this.favoriteTeamRepository.getNumberOfTeamsByUser(userId)

		if (numberOfTeams >= 5) {
			throw new BadRequestException(
				'Ya has alcanzado el máximo de equipos favoritos',
			)
		}

		if (typeof team.id !== 'number') {
			throw new BadRequestException('El equipo no es correcto')
		}

		return this.favoriteTeamRepository.saveFavoriteTeam(userId, team)
	}

	async deleteFavoriteTeam(userId: string, teamId: number) {
		if (typeof teamId !== 'number') {
			throw new BadRequestException('El equipo no es correcto')
		}

		return this.favoriteTeamRepository.deleteFavoriteTeam(userId, teamId)
	}
}
