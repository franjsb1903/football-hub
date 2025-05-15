import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import FixturesLayout from '@/layouts/fixtures-layout'
import { useFetchData } from '@/hooks'
import Players from './playes'
import Info from './info'
import { Fixture } from '@/types'
import RivalInfo from './rival'
import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'

interface FixtureProperties {
	id: number
}

export default function FixtureView({ id }: FixtureProperties) {
	const { data, status } = useSession()
	const { data: fixture, isLoading } = useFetchData<Fixture>(
		`request/fixtures/${id}`,
		data?.accessToken,
	)
	const router = useRouter()

	if (status === 'unauthenticated') {
		router.push('/login')
		return undefined
	}

	if (isLoading) {
		return <Loading />
	}

	return (
		<FixturesLayout>
			<section>
				<Button size="sm" onClick={() => router.back()}>
					Volver
				</Button>
			</section>
			<Info fixture={fixture} />
			<RivalInfo rival={fixture?.rival} />
			<Players fixture={fixture} />
		</FixturesLayout>
	)
}
