import { Venue } from '../venue'

export interface Fixture {
	id: number
	referee: string
	date: string
	venue: Pick<Venue, 'id' | 'name' | 'city'>
}
