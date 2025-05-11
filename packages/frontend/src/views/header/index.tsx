import { signOut } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import styles from './styles.module.css'

export default function Header() {
	return (
		<header className={styles.header}>
			<h3>Football Hub</h3>
			<section>
				<Button
					onClick={() =>
						signOut({
							redirect: false,
						})
					}
				>
					Cerrar sesión
				</Button>
			</section>
		</header>
	)
}
