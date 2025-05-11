import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'

export default function useSearch() {
	const [searchTerm, setSearchTerm] = useState('')
	const debouncedSearchTerm = useDebounce(searchTerm, 1000)

	useEffect(() => {
		if (debouncedSearchTerm) {
			console.log('Searching for:', debouncedSearchTerm)
		}
	}, [debouncedSearchTerm])

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault()
		setSearchTerm(event.target.value)
	}

	return {
		searchTerm,
		handleSearchChange,
	}
}
