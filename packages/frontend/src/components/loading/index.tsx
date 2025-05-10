import React from 'react'

import styles from './styles.module.css'

const Loading = () => {
	return (
		<div className={styles.container}>
			<div className={styles.loader}>
				<div className={styles.spinner} />
				<p className={styles.text}>Cargando...</p>
			</div>
		</div>
	)
}

export default Loading
