import { useMemo, useState } from 'react'

import { Team } from '@/types'
import request from '@/services/request'

export default function useFavoriteTeams(token?: string) {
	const [favoriteTeams, setFavoriteTeams] = useState<Team[]>([])

	const ids = useMemo(() => {
		return favoriteTeams.map(({ id }) => id)
	}, [favoriteTeams])

	const isFavorite = (teamId: number) => {
		return ids.includes(teamId)
	}

	const addAsFavorite = (team: Team) => {
		if (favoriteTeams.length >= 5) {
			alert('Ya has seleccionado todos los equipos')
			return
		}

		setFavoriteTeams((previousState) => [...previousState, team])
		request
			.post('request/teams/favorite', team, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			// TODO: Eliminar y emitir alerta
			.catch(() => {})
	}

	const deleteAsFavorite = (teamId: number) => {
		setFavoriteTeams((previousState) =>
			previousState.filter(({ id }) => id !== teamId),
		)
		request
			.delete(`request/teams/favorite/${teamId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			// TODO: Volver a añadir y emitir alerta
			.catch(() => {})
	}

	const toggleFavorite = (team: Team) => {
		if (isFavorite(team.id)) {
			return deleteAsFavorite(team.id)
		}
		return addAsFavorite(team)
	}

	return { favoriteTeams, isFavorite, toggleFavorite }
}
