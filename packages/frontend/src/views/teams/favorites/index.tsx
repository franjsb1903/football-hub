import { FaRegStar as Star } from 'react-icons/fa6'
import { FaStar as FilledStar } from 'react-icons/fa6'

import styles from '../styles.module.css'
import Loading from '@/components/loading'
import TeamList from '../list'
import { Team } from '@/types'

interface FavoriteTeamsProperties {
	favoriteTeams: Team[] | undefined
	isLoading: boolean
	// eslint-disable-next-line no-unused-vars
	toggleFavorite: (team: Team) => Promise<void>
	// eslint-disable-next-line no-unused-vars
	isFavorite: (teamId: number) => boolean | undefined
}

export default function FavoritesTeams({
	favoriteTeams,
	isLoading,
	isFavorite,
	toggleFavorite,
}: FavoriteTeamsProperties) {
	return (
		<section className={styles.section}>
			<h1 className={styles.title}>Tus equipos</h1>
			<p className={styles.subtitle}>
				Aquí puedes ver los equipos que has seleccionado como favoritos
			</p>
			<section className={styles.myTeamsContainer}>
				{isLoading ? (
					<Loading />
				) : favoriteTeams && favoriteTeams?.length > 0 && !isLoading ? (
					<TeamList
						teams={favoriteTeams}
						Action={({ team }) =>
							isFavorite(team.id) ? (
								<FilledStar
									onClick={() => toggleFavorite(team)}
								/>
							) : (
								<Star onClick={() => toggleFavorite(team)} />
							)
						}
					/>
				) : (
					<p className={styles.empty}>
						Todavía no tienes equipos. Emplea el buscador de tu
						izquierda para comenzar
					</p>
				)}
			</section>
		</section>
	)
}
