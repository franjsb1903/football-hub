'use client'
import React, { FormEventHandler, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

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
			return toast(emailValidation.message, { type: 'warning' })
		}

		const passwordValidation = validatePassword(user.password)
		if (!passwordValidation.valid) {
			return toast(passwordValidation.message, {
				type: 'warning',
			})
		}

		if (user.password !== user.repeatPassword) {
			return toast('Las contraseñas no coinciden', {
				type: 'warning',
			})
		}

		try {
			await request.post('request/auth/register', user)
			toast(
				'¡Registro completado con éxito! Ya puedes entrar en Football Hub',
				{
					type: 'success',
				},
			)
			router.push('/login')
		} catch (error: any) {
			console.log({ error: error.message })
			if (error && error.message && error.message === 'Conflict') {
				return toast('Ya existe un usuario con ese email', {
					type: 'error',
				})
			}
			toast('Ha ocurrido un error en el registro, vuelve a intentarlo', {
				type: 'error',
			})
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
