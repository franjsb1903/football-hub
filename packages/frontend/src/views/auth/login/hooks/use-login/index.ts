'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { FormEventHandler, useState } from 'react'
import { toast } from 'react-toastify'

export function useLogin() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const router = useRouter()

	const handleCredentialsSignIn: FormEventHandler<HTMLFormElement> = async (
		event,
	) => {
		event.preventDefault()

		try {
			const response = await signIn('credentials', {
				email,
				password,
				redirect: false,
			})

			if (response && response.ok) {
				router.push('/teams')
			} else {
				toast('No se ha podido iniciar sesión', {
					type: 'error',
				})
			}
		} catch {
			toast('No se ha podido iniciar sesión', {
				type: 'error',
			})
		}
	}

	const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value)
	}

	const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value)
	}

	return {
		email,
		password,
		router,
		onChangeEmail,
		onChangePassword,
		handleCredentialsSignIn,
	}
}
