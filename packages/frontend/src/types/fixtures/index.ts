import { League } from '../league'
import { Player } from '../player'
import { Team } from '../team'
import { Venue } from '../venue'

export interface Fixture {
	id: number
	referee: string
	date: string
	venue: Pick<Venue, 'id' | 'name' | 'city'>
	league: League
	teams: {
		home: Pick<Team, 'id' | 'name' | 'logo'>
		away: Pick<Team, 'id' | 'name' | 'logo'>
	}
	players: {
		team: Pick<Team, 'id' | 'name' | 'logo'>
		players: Player[]
	}[]
	rival: Rival
}

export interface Rival {
	team: Team
	venue: Venue
}
