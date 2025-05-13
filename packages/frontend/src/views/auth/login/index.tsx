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
import { useLogin } from './hooks/use-login'

export default function LoginForm({
	className,
	...properties
}: React.ComponentPropsWithoutRef<'div'>) {
	const {
		email,
		password,
		handleCredentialsSignIn,
		onChangeEmail,
		onChangePassword,
	} = useLogin()

	return (
		<div className={cn(styles.container, className)} {...properties}>
			<Card className={styles.card}>
				<CardHeader>
					<CardTitle className={styles.title}>
						Football Hub - Inicio de sesión
					</CardTitle>
					<CardDescription>
						Inicia sesión para acceder a tu cuenta
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
									onChange={onChangeEmail}
									value={email}
									required
								/>
							</div>
							<div className={styles.field}>
								<Label htmlFor="password">Contraseña</Label>

								<Input
									id="password"
									type="password"
									required
									value={password}
									onChange={onChangePassword}
								/>
							</div>
							<Button type="submit" className={styles.button}>
								Iniciar sesión
							</Button>
						</div>
						<div className={styles.register}>
							¿No tienes cuenta?{' '}
							<a href="/register">Regístrate</a>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
