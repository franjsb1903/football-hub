import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { PrismaProvider } from 'src/providers'
import { Team } from 'src/types'

@Injectable()
export default class FavoriteTeamRepository {
	@Inject()
	prisma: PrismaProvider

	async saveFavoriteTeam(userId: string, team: Team) {
		const numberOfTeams = await this.prisma.favoriteTeam.count({
			where: {
				userId,
			},
		})

		if (numberOfTeams >= 5) {
			throw new BadRequestException(
				'Ya has alcanzado el máximo de equipos favoritos',
			)
		}

		if (typeof team.id !== 'number') {
			throw new BadRequestException('El equipo no es correcto')
		}

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
}
