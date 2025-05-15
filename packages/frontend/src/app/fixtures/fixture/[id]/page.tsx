'use client'

import { useParams } from 'next/navigation'

import Fixture from '@/views/fixtures/fixture'

export default function FixturePage() {
	const { id } = useParams()

	const fixtureId = id as unknown as number

	return <Fixture id={fixtureId} />
}
