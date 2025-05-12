import { useEffect, useState } from 'react'

import request from '@/services/request'
import { Fixture } from '@/types'

export default function useFetchFixtures(team: number, token?: string) {
	const [fixtures, setFixtures] = useState<Fixture[]>([])

	useEffect(() => {
		request
			.get<Fixture[]>(`request/fixtures/${team}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setFixtures(response ?? [])
			})
			.catch(() => alert('Ha ocurrido un error al obtener los equipos'))
	}, [team, token])

	return { fixtures }
}
