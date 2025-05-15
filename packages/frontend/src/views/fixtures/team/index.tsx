/* eslint-disable import/order */
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import FixturesLayout from '@/layouts/fixtures-layout'

import commonStyles from '../styles.module.css'
import styles from './styles.module.css'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import Image from '@/components/image'
import { formatISODateToDDMMYYYY_HHmm } from '@/utils/date'
import { useFetchData } from '@/hooks'
import Loading from '@/components/loading'
import { Fixture } from '@/types'

interface ComingMatchesProperties {
	team: number
}

export default function ComingMatches({ team }: ComingMatchesProperties) {
	const { data, status } = useSession()
	const router = useRouter()
	const { data: fixtures, isLoading } = useFetchData<Fixture[]>(
		`request/fixtures/team/${team}`,
		data?.accessToken,
	)

	if (status === 'unauthenticated') {
		router.push('/login')
		return undefined
	}

	if (isLoading) {
		return <Loading />
	}

	return (
		<FixturesLayout>
			<h1 className={commonStyles.title}>Próximos partidos</h1>
			<section className={`${styles.list}`}>
				{fixtures?.map((fixture) => (
					<Card
						key={fixture.id}
						className={styles.card}
						onClick={() =>
							router.push(`/fixtures/fixture/${fixture.id}`)
						}
					>
						<CardHeader className={styles.cardHeader}>
							<article className={styles.content}>
								<CardTitle className={styles.cardTitle}>
									<section className="flex gap-2 items-center justify-end w-[40%]">
										<span className={styles.teamNameLeft}>
											{fixture.teams.home.name}
										</span>
										<Image
											name={fixture.teams.home.name ?? ''}
											src={fixture.teams.home.logo ?? ''}
											additionalClass="w-8 h-8"
										/>
									</section>
									<span>-</span>
									<section className="flex gap-2 items-center justify-start w-[40%]">
										<Image
											name={fixture.teams.away.name ?? ''}
											src={fixture.teams.away.logo ?? ''}
											additionalClass="w-8 h-8"
										/>
										<span className={styles.teamNameRight}>
											{fixture.teams.away.name}
										</span>
									</section>
								</CardTitle>
								<CardDescription className="text-center">
									{fixture.league.name}
								</CardDescription>
								<CardDescription className="text-center">
									{formatISODateToDDMMYYYY_HHmm(fixture.date)}
								</CardDescription>
							</article>
						</CardHeader>
					</Card>
				))}
			</section>
		</FixturesLayout>
	)
}
