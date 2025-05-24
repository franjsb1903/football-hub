export class FavoriteTeamException extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'FavoriteTeamException'
	}
}

export class MaxFavoriteTeamsReachedException extends FavoriteTeamException {
	constructor() {
		super('Ya has alcanzado el máximo de equipos favoritos')
	}
}

export class InvalidTeamException extends FavoriteTeamException {
	constructor() {
		super('El equipo no es correcto')
	}
}
