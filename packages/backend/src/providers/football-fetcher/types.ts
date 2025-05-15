import { Team, Venue } from 'src/types'
import { Fixture } from 'src/types/fixture'
import { League } from 'src/types/league'
import { Player } from 'src/types/player'

export type SearchTeamResponse = Array<{ team: Team; venue: Venue }>

export interface FixtureResponse {
	fixture: Fixture
	teams: {
		home: Pick<Team, 'id' | 'name' | 'logo'>
		away: Pick<Team, 'id' | 'name' | 'logo'>
	}
	league: League
	players: {
		team: Pick<Team, 'id' | 'name' | 'logo'>
		players: {
			player: Player
		}[]
	}[]
}

export interface TeamResponse {
	team: Team
	venue: Venue
}
