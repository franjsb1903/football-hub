import { useEffect, useState } from 'react'

import request from '@/services/request'
import { Fixture } from '@/types'

export default function useFetchData(fixtureId: number, token?: string) {
	const [fixture, setFixture] = useState<Fixture>()

	useEffect(() => {
		request
			.get<Fixture>(`request/fixtures/${fixtureId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setFixture(response)
			})
			.catch(() =>
				alert('Ha ocurrido un error al obtener la información'),
			)
	}, [fixtureId, token])

	return { fixture }
}
