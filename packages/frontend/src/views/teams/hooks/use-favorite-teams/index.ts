import { useMemo } from 'react'

import { Team } from '@/types'
import request from '@/services/request'
import { useFetchFavoriteTeams } from '@/hooks'

export default function useFavoriteTeams(token?: string) {
	const { favoriteTeams, isLoading, setFavoriteTeams } =
		useFetchFavoriteTeams(token)

	const ids = useMemo(() => {
		return favoriteTeams.map(({ id }) => id)
	}, [favoriteTeams])

	const isMaximumReached = useMemo(() => {
		return favoriteTeams.length >= 5
	}, [favoriteTeams])

	const isFavorite = (teamId: number) => {
		return ids.includes(teamId)
	}

	const addAsFavorite = async (team: Team) => {
		if (favoriteTeams.length >= 5) {
			alert('Ya has seleccionado todos los equipos')
			return
		}

		try {
			await request.post('request/favorite', team, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			setFavoriteTeams((previousState) => [...previousState, team])
		} catch {
			alert('Ha ocurrido un problema al guardar tu equipo como favorito')
		}
	}

	const deleteAsFavorite = async (teamId: number) => {
		try {
			await request.delete(`request/favorite/${teamId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			setFavoriteTeams((previousState) =>
				previousState.filter(({ id }) => id !== teamId),
			)
		} catch {
			alert('Ha ocurrido un problema al quitar tu equipo como favorito')
		}
	}

	const toggleFavorite = (team: Team) => {
		if (isFavorite(team.id)) {
			return deleteAsFavorite(team.id)
		}
		return addAsFavorite(team)
	}

	return {
		favoriteTeams,
		isMaximumReached,
		isLoading,
		isFavorite,
		toggleFavorite,
	}
}
