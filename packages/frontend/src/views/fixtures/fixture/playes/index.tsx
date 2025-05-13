import { useMemo } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import styles from './styles.module.css'
import commonStyles from '../styles.module.css'
import { Fixture } from '@/types'
import Image from '@/components/image'

interface PlayersProperties {
	fixture: Fixture | undefined
}

export default function Players({ fixture }: PlayersProperties) {
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

	return (
		<Card>
			<CardHeader>
				<CardTitle className={commonStyles.cardTitle}>
					Equipos
				</CardTitle>
			</CardHeader>
			<div className={styles.playersCard}>
				<CardContent className={styles.playersCardContent}>
					{playersHomeTeam?.map((player) => (
						<section key={player.id} className={styles.playersInfo}>
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
						<section key={player.id} className={styles.playersInfo}>
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
	)
}
