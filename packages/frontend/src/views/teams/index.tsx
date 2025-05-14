'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { FaRegStar as Star } from 'react-icons/fa6'
import { FaStar as FilledStar } from 'react-icons/fa6'

import styles from './styles.module.css'
import SearchInput from '@/components/search-input'
import TeamList from './list'
import { useFavoriteTeams, useSearch } from './hooks'
import Loading from '@/components/loading'

export default function Teams() {
	const { data, status } = useSession()
	const { searchTerm, teams, handleSearchChange } = useSearch(
		data?.accessToken,
	)
	const {
		favoriteTeams,
		isMaximumReached,
		isLoading,
		isFavorite,
		toggleFavorite,
	} = useFavoriteTeams(data?.accessToken)
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
						disabled={isMaximumReached}
						onChange={handleSearchChange}
					/>
					{isMaximumReached ? (
						<p>
							¡Genial! Ya tienes todos tus equipos seleccionados
						</p>
					) : (
						<TeamList
							teams={teams}
							additionalClass="h-[200px] md:h-[400px]"
							Action={({ team }) =>
								isFavorite(team.id) ? (
									<FilledStar
										onClick={() =>
											toggleFavorite &&
											toggleFavorite(team)
										}
									/>
								) : (
									<Star
										onClick={() =>
											toggleFavorite &&
											toggleFavorite(team)
										}
									/>
								)
							}
						/>
					)}
				</section>
			</section>
			<section className={styles.section}>
				<h1 className={styles.title}>Tus equipos</h1>
				<p className={styles.subtitle}>
					Aquí puedes ver los equipos que has seleccionado como
					favoritos
				</p>
				<section className={styles.myTeamsContainer}>
					{isLoading ? (
						<Loading />
					) : favoriteTeams &&
					  favoriteTeams?.length > 0 &&
					  !isLoading ? (
						<TeamList
							teams={favoriteTeams}
							Action={({ team }) =>
								isFavorite(team.id) ? (
									<FilledStar
										onClick={() =>
											toggleFavorite &&
											toggleFavorite(team)
										}
									/>
								) : (
									<Star
										onClick={() =>
											toggleFavorite &&
											toggleFavorite(team)
										}
									/>
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
		</div>
	)
}
