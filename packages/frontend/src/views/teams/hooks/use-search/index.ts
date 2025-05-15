import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'

import request from '@/services/request'
import { Team } from '@/types'

export default function useSearch(token?: string) {
	const [searchTerm, setSearchTerm] = useState('')
	const [teams, setTeams] = useState<Team[]>()
	const debouncedSearchTerm = useDebounce(searchTerm, 500)

	useEffect(() => {
		if (debouncedSearchTerm) {
			request
				.get<Team[]>(`request/teams?search=${debouncedSearchTerm}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					setTeams(response)
				})
		} else {
			setTeams([])
		}
	}, [debouncedSearchTerm, token])

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault()
		setSearchTerm(event.target.value)
	}

	return {
		searchTerm,
		teams,
		handleSearchChange,
	}
}
