import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'

import api from '@/services/api'

export default function useSearch(token?: string) {
	const [searchTerm, setSearchTerm] = useState('')
	const debouncedSearchTerm = useDebounce(searchTerm, 1000)

	useEffect(() => {
		if (debouncedSearchTerm) {
			api.get('teams', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}).then((reponse) => {
				console.log(reponse)
			})
		}
	}, [debouncedSearchTerm, token])

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault()
		setSearchTerm(event.target.value)
	}

	return {
		searchTerm,
		handleSearchChange,
	}
}
