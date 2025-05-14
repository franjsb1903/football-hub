import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

import FixturesLayout from '@/layouts/fixtures-layout'
import { useFetchData } from '@/hooks'
import Players from './playes'
import Info from './info'
import { Fixture } from '@/types'
import RivalInfo from './rival'
import Loading from '@/components/loading'

interface FixtureProperties {
	id: number
}

export default function FixtureView({ id }: FixtureProperties) {
	const { data, status } = useSession()
	const { data: fixture, isLoading } = useFetchData<Fixture>(
		`request/fixtures/${id}`,
		data?.accessToken,
	)

	if (status === 'unauthenticated') {
		return redirect('/login')
	}

	if (isLoading) {
		return <Loading />
	}

	return (
		<FixturesLayout>
			<Info fixture={fixture} />
			<RivalInfo rival={fixture?.rival} />
			<Players fixture={fixture} />
		</FixturesLayout>
	)
}
