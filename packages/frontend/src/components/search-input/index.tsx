import React from 'react'

import SearchIcon from '../icons/search'
import { Input } from '../ui/input'
import styles from './styles.module.css'

interface SearchInputProperties {
	placeholder?: string
	value: string
	disabled: boolean
	// eslint-disable-next-line no-unused-vars
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function SearchInput({
	placeholder,
	value,
	disabled,
	onChange,
}: SearchInputProperties) {
	return (
		<div className={styles.container}>
			<SearchIcon className={styles.icon} />
			<Input
				type="search"
				placeholder={placeholder || 'Buscar...'}
				className={styles.input}
				value={value}
				disabled={disabled}
				onChange={onChange}
			/>
		</div>
	)
}
