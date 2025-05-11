'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

import styles from './styles.module.css'
import SearchInput from '@/components/search-input'
import useSearch from './hooks/use-search'
import useFavoriteTeams from './hooks/use-favorite-teams'
import TeamList from './list'

export default function Teams() {
	const { data, status } = useSession()
	const { searchTerm, teams, handleSearchChange } = useSearch(
		data?.accessToken,
	)
	const { favoriteTeams, isFavorite, toggleFavorite } = useFavoriteTeams()
	if (status === 'unauthenticated') {
		return redirect('/login')
	}

	return (
		<div className={styles.container}>
			<section className={styles.section}>
				<h1 className={styles.title}>Buscar equipos</h1>
				<p className={styles.subtitle}>
					Selecciona hasta un máximo de 5 equipos favoritos
				</p>
				<section className={styles.searchContainer}>
					<SearchInput
						placeholder="Buscar equipos..."
						value={searchTerm}
						onChange={handleSearchChange}
					/>
					<TeamList
						teams={teams}
						isFavorite={isFavorite}
						toggleFavorite={toggleFavorite}
					/>
				</section>
			</section>
			<section className={styles.section}>
				<h1 className={styles.title}>Tus equipos</h1>
				<p className={styles.subtitle}>
					Aquí puedes ver los equipos que has seleccionado como
					favoritos
				</p>
				<section className={styles.myTeamsContainer}>
					<TeamList
						teams={favoriteTeams}
						isFavorite={isFavorite}
						toggleFavorite={toggleFavorite}
					/>
				</section>
			</section>
		</div>
	)
}
