import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { Team } from '@/types'
import request from '@/services/request'

export default function useFetchFavoriteTeams(token?: string) {
	const [favoriteTeams, setFavoriteTeams] = useState<Team[]>([])
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (token) {
			setIsLoading(true)
			request
				.get<Team[]>('request/favorite', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					setFavoriteTeams(response || [])
					setIsLoading(false)
				})
				.catch(() => {
					toast('No se han podido obtener tus equipos favoritos', {
						type: 'error',
					})
				})
		}
	}, [token])

	return {
		favoriteTeams,
		isLoading,
		setFavoriteTeams,
	}
}
