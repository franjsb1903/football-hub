export function validateEmail(email: string) {
	if (
		!new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(
			email,
		)
	) {
		return {
			valid: false,
			message: 'El email no es correcto',
		}
	}

	return { valid: true }
}

export function validatePassword(password: string) {
	if (password.length <= 8) {
		return {
			valid: false,
			message:
				'La contraseña debe de tener una longitud de al menos 8 caracteres',
		}
	}

	return { valid: true }
}
