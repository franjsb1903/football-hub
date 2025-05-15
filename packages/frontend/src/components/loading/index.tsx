import React from 'react'

import styles from './styles.module.css'
import Spinner from '../icons/spinner'

const Loading = () => {
	return (
		<div className={styles.container}>
			<div className={styles.loader}>
				<div className="flex items-center justify-center">
					<Spinner size="h-8 w-8 md:h-12 md:w-12" />
				</div>
				<p className={styles.text}>Cargando...</p>
			</div>
		</div>
	)
}

export default Loading
