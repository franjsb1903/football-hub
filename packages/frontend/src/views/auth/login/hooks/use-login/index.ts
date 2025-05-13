import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { FormEventHandler, useState } from 'react'

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
				alert('No se ha podido iniciar sesión')
			}
		} catch {
			alert('No se ha podido iniciar sesión')
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
		onChangeEmail,
		onChangePassword,
		handleCredentialsSignIn,
	}
}
