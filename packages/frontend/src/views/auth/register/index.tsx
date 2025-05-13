'use client'
import type React from 'react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import styles from '../styles.module.css'
import { useRegister } from './hooks/use-register'

export default function RegisterForm({
	className,
	...properties
}: React.ComponentPropsWithoutRef<'div'>) {
	const { user, onChangeUser, handleCredentialsSignIn } = useRegister()

	return (
		<div className={cn(styles.container, className)} {...properties}>
			<Card className={styles.card}>
				<CardHeader>
					<CardTitle className={styles.title}>
						Football Hub - Registro
					</CardTitle>
					<CardDescription>
						Regístrate para acceder a la plataforma
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleCredentialsSignIn}>
						<div className={styles.form}>
							<div className={styles.field}>
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="email@example.com"
									required
									value={user.email}
									onChange={onChangeUser}
								/>
							</div>
							<div className={styles.field}>
								<Label htmlFor="email">Nombre</Label>
								<Input
									id="name"
									type="text"
									placeholder="Teimas"
									required
									value={user.name}
									onChange={onChangeUser}
								/>
							</div>
							<div className={styles.field}>
								<Label htmlFor="password">Contraseña</Label>
								<Input
									id="password"
									type="password"
									required
									value={user.password}
									onChange={onChangeUser}
								/>
							</div>
							<div className={styles.field}>
								<Label htmlFor="repeatPassword">
									Repite tu contraseña
								</Label>
								<Input
									id="repeatPassword"
									type="password"
									required
									value={user.repeatPassword}
									onChange={onChangeUser}
								/>
							</div>
							<Button type="submit" className={styles.button}>
								Regístrate
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
