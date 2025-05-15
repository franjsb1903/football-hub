'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { useFetchData } from '@/hooks'
import TeamList from '../teams/list'
import styles from './styles.module.css'
import { Button } from '@/components/ui/button'
import FixturesLayout from '@/layouts/fixtures-layout'
import { Team } from '@/types'
import Loading from '@/components/loading'

export default function Fixtures() {
	const { data, status } = useSession()
	const { data: favoriteTeams, isLoading } = useFetchData<Team[]>(
		'request/favorite',
		data?.accessToken,
	)
	const router = useRouter()

	if (status === 'unauthenticated') {
		router.push('/login')
		return undefined
	}

	return (
		<FixturesLayout>
			<h1 className={styles.title}>Próximos partidos</h1>
			<h3 className={styles.subtitle}>
				Selecciona un equipo para ver sus próximos partidos
			</h3>
			{isLoading ? (
				<Loading />
			) : (
				<>
					<TeamList
						teams={favoriteTeams}
						Action={({ team }) => (
							<Button
								onClick={() => {
									router.push(`/fixtures/${team.id}`)
								}}
							>
								Ver
							</Button>
						)}
					/>
				</>
			)}
		</FixturesLayout>
	)
}
