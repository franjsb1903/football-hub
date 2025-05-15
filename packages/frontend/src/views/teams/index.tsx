'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import styles from './styles.module.css'
import { useFavoriteTeams } from './hooks'
import FavoritesTeams from './favorites'
import SearchTeams from './search'

export default function Teams() {
	const { data, status } = useSession()

	const {
		favoriteTeams,
		isMaximumReached,
		isLoading,
		isFavorite,
		toggleFavorite,
	} = useFavoriteTeams(data?.accessToken)
	const router = useRouter()

	if (status === 'unauthenticated') {
		router.push('/login')
		return undefined
	}

	return (
		<div className={styles.container}>
			<SearchTeams
				accessToken={data?.accessToken}
				isMaximumReached={isMaximumReached}
				isFavorite={isFavorite}
				toggleFavorite={toggleFavorite}
			/>
			<FavoritesTeams
				favoriteTeams={favoriteTeams}
				isLoading={isLoading}
				isFavorite={isFavorite}
				toggleFavorite={toggleFavorite}
			/>
		</div>
	)
}
