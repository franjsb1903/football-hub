export function formatISODateToDDMMYYYY_HHmm(isoString: string) {
	const date = new Date(isoString)

	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0') // getMonth() devuelve de 0 a 11, por eso sumamos 1
	const year = date.getFullYear()
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')

	return `${day}/${month}/${year} ${hours}:${minutes}`
}
