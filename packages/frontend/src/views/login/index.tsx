'use client'
import type React from 'react'
import { FormEventHandler, useState } from 'react'
import { signIn } from 'next-auth/react'

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
import styles from './styles.module.css'

export default function LoginForm({
	className,
	...properties
}: React.ComponentPropsWithoutRef<'div'>) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleCredentialsSignIn: FormEventHandler<HTMLFormElement> = async (
		event,
	) => {
		event.preventDefault()
		console.log({ email, password })
		const response = await signIn('credentials', {
			email,
			password,
			redirect: false,
		})
		console.log({ response })
	}

	return (
		<div className={cn(styles.container, className)} {...properties}>
			<Card>
				<CardHeader>
					<CardTitle className={styles.title}>Login</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
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
									placeholder="m@example.com"
									onChange={(event) =>
										setEmail(event.target.value)
									}
									value={email}
									required
								/>
							</div>
							<div className={styles.field}>
								<Label htmlFor="password">Password</Label>

								<Input
									id="password"
									type="password"
									required
									value={password}
									onChange={(event) =>
										setPassword(event.target.value)
									}
								/>
							</div>
							<Button type="submit" className={styles.button}>
								Login
							</Button>
						</div>
						<div className={styles.register}>
							Don&apos;t have an account?{' '}
							<a href="/register">Sign up</a>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
