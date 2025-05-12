/* eslint-disable import/order */
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

import FixturesLayout from '@/layouts/fixtures-layout'
import useFetchFixtures from './hooks/use-fetch-team-fixtures'

interface ComingMatchesProperties {
	team: number
}

import commonStyles from '../styles.module.css'
import styles from './styles.module.css'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import TeamLogo from '@/components/team-logo'

function formatISODateToDDMMYYYY_HHmm(isoString: string) {
	const date = new Date(isoString)

	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0') // getMonth() devuelve de 0 a 11, por eso sumamos 1
	const year = date.getFullYear()
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')

	return `${day}/${month}/${year} ${hours}:${minutes}`
}

export default function ComingMatches({ team }: ComingMatchesProperties) {
	const { data, status } = useSession()

	const { fixtures } = useFetchFixtures(team, data?.accessToken)

	if (status === 'unauthenticated') {
		return redirect('/login')
	}

	console.log({ fixtures })

	return (
		<FixturesLayout>
			<h1 className={commonStyles.title}>Próximos partidos</h1>
			<section className={`${styles.list}`}>
				{fixtures?.map((fixture) => (
					<Card key={fixture.id}>
						<CardHeader className={styles.cardHeader}>
							<article className={styles.content}>
								<CardTitle className={styles.cardTitle}>
									<span className="flex gap-2 items-center justify-end w-[40%]">
										{fixture.teams.home.name}
										<TeamLogo
											name={fixture.teams.home.name ?? ''}
											logo={fixture.teams.home.logo ?? ''}
											additionalClass="w-8 h-8"
										/>
									</span>
									<span>-</span>
									<span className="flex gap-2 items-center justify-start w-[40%]">
										<TeamLogo
											name={fixture.teams.away.name ?? ''}
											logo={fixture.teams.away.logo ?? ''}
											additionalClass="w-8 h-8"
										/>
										{fixture.teams.away.name}
									</span>
								</CardTitle>
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
