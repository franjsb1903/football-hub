/* eslint-disable no-unused-vars */
import { FaRegStar as Star } from 'react-icons/fa6'
import { FaStar as FilledStar } from 'react-icons/fa6'

import { Team } from '@/types'
import styles from './styles.module.css'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

interface TeamListProperties {
	teams?: Team[]
	isFavorite: (teamId: number) => boolean
	toggleFavorite: (team: Team) => void
}

export default function TeamList({
	teams,
	isFavorite,
	toggleFavorite,
}: TeamListProperties) {
	return (
		<section className={styles.list}>
			{teams?.map((team) => (
				<Card key={team.id}>
					<CardHeader>
						<CardTitle className={styles.cardTitle}>
							{team.name}{' '}
							{isFavorite(team.id) ? (
								<FilledStar
									onClick={() => toggleFavorite(team)}
								/>
							) : (
								<Star onClick={() => toggleFavorite(team)} />
							)}
						</CardTitle>
						<CardDescription>
							País: {team.country ?? '-'}
						</CardDescription>
					</CardHeader>
				</Card>
			))}
		</section>
	)
}
