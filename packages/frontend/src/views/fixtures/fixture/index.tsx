import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { GiWhistle, GiFlyingFlag } from 'react-icons/gi'
import { MdStadium } from 'react-icons/md'
import { useMemo } from 'react'

import FixturesLayout from '@/layouts/fixtures-layout'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import Image from '@/components/image'
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

	const playersHomeTeam = useMemo(() => {
		return fixture?.players.find(
			(item) => item.team.id === fixture.teams.home.id,
		)?.players
	}, [fixture])

	const playersAwayTeam = useMemo(() => {
		return fixture?.players.find(
			(item) => item.team.id === fixture.teams.away.id,
		)?.players
	}, [fixture])

	console.log({ playersHomeTeam })

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
								<Image
									name={fixture?.teams.home.name ?? ''}
									src={fixture?.teams.home.logo ?? ''}
									additionalClass="w-8 h-8"
								/>
							</section>
							<CardDescription className="text-center">
								{formatISODateToDDMMYYYY_HHmm(
									fixture?.date ?? '',
								)}
							</CardDescription>
							<section className="flex gap-2 items-center justify-start w-[40%]">
								<Image
									name={fixture?.teams.away.name ?? ''}
									src={fixture?.teams.away.logo ?? ''}
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
			<Card>
				<CardHeader>
					<CardTitle className={styles.playersTitle}>
						Equipos
					</CardTitle>
				</CardHeader>
				<div className={styles.playersCard}>
					<CardContent className={styles.playersCardContent}>
						{playersHomeTeam?.map((player) => (
							<section
								key={player.id}
								className={styles.playersInfo}
							>
								<Image
									src={player.photo || ''}
									name={player.name}
									additionalClass="w-8 h-8"
								/>
								<span key={player.id}>{player.name}</span>
							</section>
						))}
					</CardContent>
					<CardContent className={styles.playersCardContent}>
						{playersAwayTeam?.map((player) => (
							<section
								key={player.id}
								className={styles.playersInfo}
							>
								<Image
									src={player.photo || ''}
									name={player.name}
									additionalClass="w-8 h-8"
								/>
								<span key={player.id}>{player.name}</span>
							</section>
						))}
					</CardContent>
				</div>
			</Card>
		</FixturesLayout>
	)
}
