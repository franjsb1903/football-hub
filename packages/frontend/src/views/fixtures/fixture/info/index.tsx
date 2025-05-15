import { GiWhistle, GiFlyingFlag } from 'react-icons/gi'
import { MdStadium } from 'react-icons/md'

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
import { Fixture } from '@/types'

interface InfoProperties {
	fixture: Fixture | undefined
}

export default function Info({ fixture }: InfoProperties) {
	return (
		<Card>
			<CardHeader>
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
						{formatISODateToDDMMYYYY_HHmm(fixture?.date ?? '')}
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
	)
}
