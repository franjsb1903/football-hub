import { ReactNode } from 'react'

import styles from './styles.module.css'

export default function FixturesLayout({ children }: { children: ReactNode }) {
	return <div className={styles.container}>{children}</div>
}
