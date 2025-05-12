import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

import useFetchFixtures from './hooks/use-fetch-team-fixtures'

interface ComingMatchesProperties {
	team: number
}

export default function ComingMatches({ team }: ComingMatchesProperties) {
	const { data, status } = useSession()

	const { fixtures } = useFetchFixtures(team, data?.accessToken)

	if (status === 'unauthenticated') {
		return redirect('/login')
	}

	return (
		<div>
			{fixtures.map((fixture) => (
				<p key={fixture.id}>{fixture.date}</p>
			))}
		</div>
	)
}
