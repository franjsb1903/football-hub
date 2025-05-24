export class InvalidEmailFormatException extends Error {
	constructor() {
		super('El formato del email no es válido')
		this.name = 'InvalidEmailFormatException'
	}
}

export class UserAlreadyExistsException extends Error {
	constructor() {
		super('Ya existe un usuario con ese email')
		this.name = 'UserAlreadyExistsException'
	}
}

export class UserNotFoundException extends Error {
	constructor() {
		super('Usuario no encontrado')
		this.name = 'UserNotFoundException'
	}
}

export class InvalidPasswordException extends Error {
	constructor() {
		super('Contraseña incorrecta')
		this.name = 'InvalidPasswordException'
	}
}

export class MissingRequiredFieldsException extends Error {
	constructor() {
		super('Faltan campos requeridos')
		this.name = 'MissingRequiredFieldsException'
	}
}
