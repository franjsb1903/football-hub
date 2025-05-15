'use client'

import { useParams } from 'next/navigation'

import FixturesTeam from '@/views/fixtures/team'

export default function FixturesTeamPage() {
	const { team } = useParams()

	const teamId = team as unknown as number

	return <FixturesTeam team={teamId} />
}
