import SearchIcon from '../icons/search'
import { Input } from '../ui/input'
import styles from './styles.module.css'

interface SearchInputProperties {
	placeholder?: string
}

export default function SearchInput({ placeholder }: SearchInputProperties) {
	return (
		<div className={styles.container}>
			<SearchIcon className={styles.icon} />
			<Input
				type="search"
				placeholder={placeholder || 'Buscar...'}
				className={styles.input}
			/>
		</div>
	)
}
