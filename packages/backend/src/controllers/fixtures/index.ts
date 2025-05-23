import {
	Controller,
	Get,
	Inject,
	InternalServerErrorException,
	Logger,
	Param,
	UseGuards,
} from '@nestjs/common'
import { AuthGuard } from 'src/guards'
import { FootballFetcherProvider } from 'src/providers'

@Controller('/fixtures')
@UseGuards(AuthGuard)
export default class FixturesController {
	@Inject()
	footballFetcher: FootballFetcherProvider
	@Inject()
	logger: Logger

	@Get('/:id')
	async getFixture(@Param('id') id: number) {
		try {
			const fixture = await this.footballFetcher.getFixture(id)
			return fixture
		} catch (error) {
			this.logger.error(`Error getting fixture ${id}`, error)
			throw new InternalServerErrorException(
				`Ha ocurrido un error obteniendo el partido`,
			)
		}
	}

	@Get('/team/:id')
	async getNextTeamFixtures(@Param('id') teamId: number) {
		try {
			const fixture = await this.footballFetcher.getFixturesByTeam(teamId)
			return fixture
		} catch (error) {
			this.logger.error(`Error getting fixtures of team ${teamId}`, error)
			throw new InternalServerErrorException(
				`Ha ocurrido un error obteniendo los partidos del equipo`,
			)
		}
	}
}
