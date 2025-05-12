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

	@Get('/coming/:id')
	async getNextFixtures(@Param('id') teamId: number) {
		try {
			return this.footballFetcher.getFixtures(teamId)
		} catch (error) {
			this.logger.error(`Error getting fixtures of team ${teamId}`, error)
			throw new InternalServerErrorException(
				`Ha ocurrido un error obteniendo los partidos del equipo`,
			)
		}
	}
}
