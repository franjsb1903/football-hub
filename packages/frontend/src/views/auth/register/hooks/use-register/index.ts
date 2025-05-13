'use client'
import React, { FormEventHandler, useState } from 'react'
import { useRouter } from 'next/navigation'

import { validateEmail, validatePassword } from '@/utils/user'
import request from '@/services/request'

interface RegisterUser {
	email: string
	name: string
	password: string
	repeatPassword: string
}

export function useRegister() {
	const [user, setUser] = useState<RegisterUser>({
		email: '',
		name: '',
		password: '',
		repeatPassword: '',
	})
	const router = useRouter()

	const handleCredentialsSignIn: FormEventHandler<HTMLFormElement> = async (
		event,
	) => {
		event.preventDefault()

		const emailValidation = validateEmail(user.email)
		if (!emailValidation.valid) {
			return alert(emailValidation.message)
		}

		const passwordValidation = validatePassword(user.password)
		if (!passwordValidation.valid) {
			return alert(passwordValidation.message)
		}

		if (user.password !== user.repeatPassword) {
			return alert('Las contraseñas no coinciden')
		}

		try {
			await request.post('request/auth/register', user)
			alert(
				'¡Registro completado con éxito! Ya puedes entrar en Football Hub',
			)
			router.push('/login')
		} catch (error: any) {
			console.log({ error: error.message })
			if (error && error.message && error.message === 'Conflict') {
				return alert('Ya existe un usuario con ese email')
			}
			alert('Ha ocurrido un error en el registro, vuelve a intentarlo')
		}
	}

	const onChangeUser = (event: React.ChangeEvent<HTMLInputElement>) => {
		const field = event.target.id
		const value = event.target.value

		if (!Object.keys(user).includes(field)) return

		setUser((previousState) => ({
			...previousState,
			[field]: value,
		}))
	}

	return {
		user,
		onChangeUser,
		handleCredentialsSignIn,
	}
}
