import React from 'react'

import { Team } from '@/types'
import styles from './styles.module.css'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import TeamLogo from '@/components/team-logo'

interface TeamListProperties {
	teams?: Team[]
	additionalClass?: string
	Action: React.ElementType<{ team: Team }>
}

export default function TeamList({
	teams,
	additionalClass,
	Action,
}: TeamListProperties) {
	return (
		<section className={`${styles.list} ${additionalClass}`}>
			{teams?.map((team) => (
				<Card key={team.id}>
					<CardHeader className={styles.cardHeader}>
						<TeamLogo
							name={team.name ?? ''}
							logo={team.logo ?? ''}
						/>
						<article className="flex flex-col w-full">
							<CardTitle className={styles.cardTitle}>
								{team.name}
								<Action team={team} />
							</CardTitle>
							<CardDescription>
								País: {team.country ?? '-'}
							</CardDescription>
						</article>
					</CardHeader>
				</Card>
			))}
		</section>
	)
}
