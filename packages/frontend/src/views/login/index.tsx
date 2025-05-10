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
import styles from './styles.module.css'

export default function LoginForm({
	className,
	...properties
}: React.ComponentPropsWithoutRef<'div'>) {
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
					<form>
						<div className={styles.form}>
							<div className={styles.field}>
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									required
								/>
							</div>
							<div className={styles.field}>
								<Label htmlFor="password">Password</Label>

								<Input id="password" type="password" required />
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
