import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { SlLogout as Logout } from 'react-icons/sl'

import styles from './styles.module.css'

export default function Header() {
	return (
		<header className={styles.header}>
			<h3>Football Hub</h3>
			<section className={styles.links}>
				<Link href="/fixtures">Partidos</Link>
				<Link href="/teams">Mis equipos</Link>
				<Logout
					className={styles.button}
					onClick={() =>
						signOut({
							redirect: false,
						})
					}
				/>
			</section>
		</header>
	)
}
