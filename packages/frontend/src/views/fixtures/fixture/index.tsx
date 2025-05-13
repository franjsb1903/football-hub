import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { GiWhistle, GiFlyingFlag } from 'react-icons/gi'
import { MdStadium } from 'react-icons/md'

import FixturesLayout from '@/layouts/fixtures-layout'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import TeamLogo from '@/components/team-logo'
import { formatISODateToDDMMYYYY_HHmm } from '@/utils/date'
import styles from './styles.module.css'
import { useFetchData } from '@/hooks'
import { Fixture } from '@/types'

interface FixtureProperties {
	id: number
}

export default function FixtureView({ id }: FixtureProperties) {
	const { data, status } = useSession()
	const { data: fixture } = useFetchData<Fixture>(
		`request/fixtures/${id}`,
		data?.accessToken,
	)

	if (status === 'unauthenticated') {
		return redirect('/login')
	}

	return (
		<FixturesLayout>
			<Card>
				<CardHeader className={styles.cardHeader}>
					<article>
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
							<CardDescription className="text-center">
								{formatISODateToDDMMYYYY_HHmm(
									fixture?.date ?? '',
								)}
							</CardDescription>
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
					</article>
				</CardHeader>
				<CardContent className={styles.content}>
					<span>
						<GiWhistle /> {fixture?.referee}
					</span>
					<span>
						<GiFlyingFlag /> {fixture?.league.name} -{' '}
						{fixture?.league.round}
					</span>
					<span>
						<MdStadium /> {fixture?.venue.name}
					</span>
				</CardContent>
			</Card>
		</FixturesLayout>
	)
}
