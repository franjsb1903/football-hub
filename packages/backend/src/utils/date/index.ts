export function getSpainDate() {
	const now = new Date()
	now.setUTCFullYear(2023)

	const options = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		timeZone: 'Europe/Madrid',
	} as const

	const spanishDate = now.toLocaleString('en-CA', options)

	return spanishDate
}
