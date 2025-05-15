import { useMemo } from 'react'
import { toast } from 'react-toastify'

import { Team } from '@/types'
import request from '@/services/request'
import { useFetchData } from '@/hooks'

export default function useFavoriteTeams(token?: string) {
	const {
		data: favoriteTeams,
		isLoading,
		setData: setFavoriteTeams,
	} = useFetchData<Team[]>('request/favorite', token)

	const ids = useMemo(() => {
		return favoriteTeams?.map(({ id }) => id)
	}, [favoriteTeams])

	const isMaximumReached = useMemo(() => {
		return favoriteTeams ? favoriteTeams?.length >= 5 : true
	}, [favoriteTeams])

	const isFavorite = (teamId: number) => {
		return ids?.includes(teamId)
	}

	const addAsFavorite = async (team: Team) => {
		if (favoriteTeams?.length && favoriteTeams?.length >= 5) {
			toast('Ya has seleccionado todos los equipos', {
				type: 'warning',
			})
			return
		}

		try {
			await request.post('request/favorite', team, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			setFavoriteTeams((previousState) => [
				...(previousState || []),
				team,
			])
			toast('Equipo añadido como favorito', {
				type: 'success',
			})
		} catch {
			toast(
				'Ha ocurrido un problema al guardar tu equipo como favorito',
				{
					type: 'error',
				},
			)
		}
	}

	const deleteAsFavorite = async (teamId: number) => {
		try {
			await request.delete(`request/favorite/${teamId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			setFavoriteTeams(
				(previousState) =>
					previousState?.filter(({ id }) => id !== teamId) ?? [],
			)
			toast('Equipo eliminado como favorito', {
				type: 'success',
			})
		} catch {
			toast('Ha ocurrido un problema al quitar tu equipo como favorito', {
				type: 'error',
			})
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
