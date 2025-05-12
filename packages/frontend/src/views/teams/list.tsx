import React from 'react'
import Image from 'next/image'

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
						<div className="relative w-[20%]">
							<Image
								src={team.logo || '/placeholder-logo.png'}
								alt={`Logo de ${team.name}`}
								fill
								className="object-contain"
								priority
								sizes="(max-width: 768px) 20vw, (max-width: 1200px) 15vw, 10vw"
							/>
						</div>
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
