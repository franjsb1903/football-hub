import { FaRegStar as Star } from 'react-icons/fa6'
import { FaStar as FilledStar } from 'react-icons/fa6'

import SearchInput from '@/components/search-input'
import styles from '../styles.module.css'
import TeamList from '../list'
import { useSearch } from '../hooks'
import { Team } from '@/types'

interface SearchTeamProperties {
	accessToken: string | undefined
	isMaximumReached: boolean
	// eslint-disable-next-line no-unused-vars
	isFavorite: (teamId: number) => boolean | undefined
	// eslint-disable-next-line no-unused-vars
	toggleFavorite: (team: Team) => Promise<void>
}

export default function SearchTeams({
	accessToken,
	isMaximumReached,
	isFavorite,
	toggleFavorite,
}: SearchTeamProperties) {
	const { searchTerm, teams, handleSearchChange } = useSearch(accessToken)

	return (
		<section className={styles.section}>
			<h1 className={styles.title}>Buscar equipos</h1>
			<p className={styles.subtitle}>
				Selecciona hasta un máximo de 5 equipos favoritos
			</p>
			<section className={styles.searchContainer}>
				<SearchInput
					placeholder="Buscar equipos..."
					value={searchTerm}
					disabled={isMaximumReached}
					onChange={handleSearchChange}
				/>
				{isMaximumReached ? (
					<p>¡Genial! Ya tienes todos tus equipos seleccionados</p>
				) : (
					<TeamList
						teams={teams}
						additionalClass="h-[200px] md:h-[400px]"
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
				)}
			</section>
		</section>
	)
}
