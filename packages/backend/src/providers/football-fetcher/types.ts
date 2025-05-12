import { Team, Venue } from 'src/types'
import { League } from 'src/types/league'

export type SearchTeamResponse = Array<{ team: Team; venue: Venue }>

export interface FixtureResponse {
	fixture: {
		id: number
		referee: string
		date: string
		venue: Pick<Venue, 'id' | 'name' | 'city'>
		teams: {
			home: Pick<Team, 'id' | 'name' | 'logo'>
			away: Pick<Team, 'id' | 'name' | 'logo'>
		}
	}
	teams: {
		home: {
			id: number
			name: string
			logo: string
		}
		away: {
			id: number
			name: string
			logo: string
		}
	}
	league: League
}
