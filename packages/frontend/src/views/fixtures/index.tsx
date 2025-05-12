'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

import { useFetchFavoriteTeams } from '@/hooks'
import TeamList from '../teams/list'
import styles from './styles.module.css'
import { Button } from '@/components/ui/button'

export default function Fixtures() {
	const { data, status } = useSession()
	const { favoriteTeams, isLoading } = useFetchFavoriteTeams(
		data?.accessToken,
	)

	if (status === 'unauthenticated') {
		return redirect('/login')
	}

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Próximos partidos</h1>
			<h3 className={styles.subtitle}>
				Selecciona un equipo para ver sus próximos partidos
			</h3>
			{isLoading ? (
				<p>Cargando...</p>
			) : (
				<TeamList
					teams={favoriteTeams}
					Action={({ team }) => (
						<Button onClick={() => console.log({ team })}>
							Ver
						</Button>
					)}
				/>
			)}
		</div>
	)
}
