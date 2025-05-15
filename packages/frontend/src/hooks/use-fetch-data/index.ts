import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

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
					toast('No se han podido obtener tus equipos favoritos', {
						type: 'error',
					})
				})
		}
	}, [path, token])

	return {
		data,
		isLoading,
		setData,
	}
}
