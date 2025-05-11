'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

import styles from './styles.module.css'
import SearchInput from '@/components/search-input'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

export default function Teams() {
	const { status } = useSession()

	if (status === 'unauthenticated') {
		return redirect('/login')
	}

	return (
		<div className={styles.container}>
			<section className={styles.section}>
				<h1 className={styles.title}>Buscar equipos</h1>
				<p className={styles.subtitle}>
					Selecciona hasta un máximo de 5 equipos favoritos
				</p>
				<section className={styles.searchContainer}>
					<SearchInput placeholder="Buscar equipos..." />
					<section className={styles.list}>
						{[
							'Real Madrid',
							'Bilbao',
							'Barcelona',
							'Atlético de Madrid',
						].map((team) => (
							<Card key={team}>
								<CardHeader>
									<CardTitle>{team}</CardTitle>
								</CardHeader>
							</Card>
						))}
					</section>
				</section>
			</section>
			<section className={styles.section}>
				<h1 className={styles.title}>Tus equipos</h1>
				<p className={styles.subtitle}>
					Aquí puedes ver los equipos que has seleccionado como
					favoritos
				</p>
				<section className={styles.myTeamsContainer}>
					<section className={styles.list}>
						{[
							'Real Madrid',
							'Bilbao',
							'Barcelona',
							'Atlético de Madrid',
						].map((team) => (
							<Card key={team}>
								<CardHeader>
									<CardTitle>{team}</CardTitle>
								</CardHeader>
							</Card>
						))}
					</section>
				</section>
			</section>
		</div>
	)
}
