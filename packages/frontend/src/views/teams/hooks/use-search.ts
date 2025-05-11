import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'

import request from '@/services/request'

export default function useSearch(token?: string) {
	const [searchTerm, setSearchTerm] = useState('')
	const debouncedSearchTerm = useDebounce(searchTerm, 1000)

	useEffect(() => {
		if (debouncedSearchTerm) {
			request
				.get('request/teams', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((reponse) => {
					console.log({ reponse })
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
