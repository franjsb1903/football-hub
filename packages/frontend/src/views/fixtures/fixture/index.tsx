import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

import FixturesLayout from '@/layouts/fixtures-layout'
import useFetchData from './hooks/use-fetch-data'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import TeamLogo from '@/components/team-logo'
import { formatISODateToDDMMYYYY_HHmm } from '@/utils/date'
import styles from './styles.module.css'

interface FixtureProperties {
	id: number
}

export default function Fixture({ id }: FixtureProperties) {
	const { data, status } = useSession()
	const { fixture } = useFetchData(id, data?.accessToken)

	if (status === 'unauthenticated') {
		return redirect('/login')
	}

	return (
		<FixturesLayout>
			<Card>
				<CardHeader className={styles.cardHeader}>
					<article className={styles.content}>
						<CardTitle className={styles.cardTitle}>
							<section className="flex gap-2 items-center justify-end w-[40%]">
								<span className={styles.teamNameLeft}>
									{fixture?.teams.home.name}
								</span>
								<TeamLogo
									name={fixture?.teams.home.name ?? ''}
									logo={fixture?.teams.home.logo ?? ''}
									additionalClass="w-8 h-8"
								/>
							</section>
							<span>-</span>
							<section className="flex gap-2 items-center justify-start w-[40%]">
								<TeamLogo
									name={fixture?.teams.away.name ?? ''}
									logo={fixture?.teams.away.logo ?? ''}
									additionalClass="w-8 h-8"
								/>
								<span className={styles.teamNameRight}>
									{fixture?.teams.away.name}
								</span>
							</section>
						</CardTitle>
						<CardDescription className="text-center">
							{fixture?.league.name}
						</CardDescription>
						<CardDescription className="text-center">
							{formatISODateToDDMMYYYY_HHmm(fixture?.date ?? '')}
						</CardDescription>
					</article>
				</CardHeader>
			</Card>
		</FixturesLayout>
	)
}
