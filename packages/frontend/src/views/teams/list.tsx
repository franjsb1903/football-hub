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
	showStar?: boolean
	heightClass?: string
	isFavorite?: (teamId: number) => boolean
	toggleFavorite?: (team: Team) => void
}

export default function TeamList({
	teams,
	showStar,
	heightClass,
	isFavorite,
	toggleFavorite,
}: TeamListProperties) {
	return (
		<section className={`${styles.list} ${heightClass}`}>
			{teams?.map((team) => (
				<Card key={team.id}>
					<CardHeader className={styles.cardHeader}>
						<img
							src={team.logo || ''}
							alt={`Logo de ${team.name}`}
							width={50}
							height={25}
						/>
						<article className="flex flex-col w-full">
							<CardTitle className={styles.cardTitle}>
								{team.name}{' '}
								{showStar &&
								isFavorite &&
								isFavorite(team.id) ? (
									<FilledStar
										onClick={() =>
											toggleFavorite &&
											toggleFavorite(team)
										}
									/>
								) : showStar && isFavorite ? (
									<Star
										onClick={() =>
											toggleFavorite &&
											toggleFavorite(team)
										}
									/>
								) : undefined}
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
