import { GiCalendar, GiTowerFlag } from 'react-icons/gi'
import {
	MdStadium,
	MdLocationCity,
	MdDriveFileRenameOutline,
} from 'react-icons/md'
import { FaAddressCard } from 'react-icons/fa'
import { FaPeopleGroup } from 'react-icons/fa6'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import commonStyles from '../styles.module.css'
import styles from './styles.module.css'
import { Rival } from '@/types'
import Image from '@/components/image'

interface RivalInfoProperties {
	rival: Rival | undefined
}

export default function RivalInfo({ rival }: RivalInfoProperties) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className={commonStyles.cardTitle}>Rival</CardTitle>
			</CardHeader>
			<CardContent className={styles.content}>
				<section className={styles.logoAndName}>
					<Image
						src={rival?.team.logo || ''}
						name={rival?.team.name || ''}
						additionalClass="h-10 w-10"
					/>
					<h3>{rival?.team.name}</h3>
				</section>
				<section className={styles.information}>
					<span className={styles.metadata}>
						<GiTowerFlag />
						{rival?.team.country}
					</span>
					<span className={styles.metadata}>
						<GiCalendar /> {rival?.team.founded}
					</span>
					<span className={styles.metadata}>
						<MdDriveFileRenameOutline /> {rival?.team.code}
					</span>
				</section>
				<section className={styles.stadium}>
					<h6>Estadio</h6>
					<span className={styles.metadata}>
						<MdStadium /> {rival?.venue.name}
					</span>
					<span className={styles.metadata}>
						<MdLocationCity /> {rival?.venue.city}
					</span>
					<span className={styles.metadata}>
						<FaAddressCard /> {rival?.venue.address}
					</span>
					<span className={styles.metadata}>
						<FaPeopleGroup /> {rival?.venue.capacity}
					</span>
				</section>
			</CardContent>
		</Card>
	)
}
