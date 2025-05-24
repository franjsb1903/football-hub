import { Inject, Injectable } from '@nestjs/common'
import { Team } from 'src/types'
import { DatabaseService } from 'src/database'

@Injectable()
export default class FavoriteTeamRepository {
	@Inject()
	db: DatabaseService

	async getNumberOfTeamsByUser(userId: string) {
		return this.db.favoriteTeam.count({
			where: {
				userId,
			},
		})
	}

	async getAllByUser(userId: string) {
		return this.db.favoriteTeam.findMany({
			where: {
				userId,
			},
		})
	}

	async saveFavoriteTeam(userId: string, team: Team) {
		return this.db.favoriteTeam.create({
			data: {
				userId,
				code: team.code || '',
				country: team.country || '',
				name: team.name || '',
				teamId: team.id,
				teamLogo: team.logo || '',
			},
		})
	}

	async deleteFavoriteTeam(userId: string, teamId: number) {
		return this.db.favoriteTeam.delete({
			where: {
				userId_teamId: {
					userId,
					teamId,
				},
			},
		})
	}
}
