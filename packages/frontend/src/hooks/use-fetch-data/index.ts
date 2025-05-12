import { useEffect, useState } from 'react'

import request from '@/services/request'

export default function useFetchData<T>(path: string, token?: string) {
	const [data, setData] = useState<T | undefined>()
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (token) {
			setIsLoading(true)
			request
				.get<T>(path, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					setData(response)
					setIsLoading(false)
				})
				.catch(() => {
					alert('No se han podido obtener tus equipos favoritos')
				})
		}
	}, [path, token])

	return {
		data,
		isLoading,
		setData,
	}
}
