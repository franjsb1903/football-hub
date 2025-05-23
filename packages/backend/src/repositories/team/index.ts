import { Inject, Injectable } from '@nestjs/common'
import { Team } from 'src/types'
import { PrismaProvider } from 'src/providers'

@Injectable()
export default class FavoriteTeamRepository {
	@Inject()
	prisma: PrismaProvider

	async getNumberOfTeamsByUser(userId: string) {
		return this.prisma.favoriteTeam.count({
			where: {
				userId,
			},
		})
	}

	async getAllByUser(userId: string) {
		return this.prisma.favoriteTeam.findMany({
			where: {
				userId,
			},
		})
	}

	async saveFavoriteTeam(userId: string, team: Team) {
		return this.prisma.favoriteTeam.create({
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
		return this.prisma.favoriteTeam.delete({
			where: {
				userId_teamId: {
					userId,
					teamId,
				},
			},
		})
	}
}
