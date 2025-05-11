import { useMemo, useState } from 'react'

import { Team } from '@/types'

export default function useFavoriteTeams() {
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
	}

	const deleteAsFavorite = (teamId: number) => {
		setFavoriteTeams((previousState) =>
			previousState.filter(({ id }) => id !== teamId),
		)
	}

	const toggleFavorite = (team: Team) => {
		if (isFavorite(team.id)) {
			return deleteAsFavorite(team.id)
		}
		return addAsFavorite(team)
	}

	return { favoriteTeams, isFavorite, toggleFavorite }
}
