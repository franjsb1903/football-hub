import { NextRequest, NextResponse } from 'next/server'

import api from '@/services/api'

export async function GET(
	request: NextRequest,
	{ params }: { params: { path: string | string[] } },
) {
	const token = request.headers.get('Authorization')?.split(' ')[1]

	const path = Array.isArray(params.path) ? params.path[0] : params.path
	const searchParameters = request.nextUrl.searchParams

	const parameters = searchParameters.entries()
	const requestParameters = []

	for (const parameter of parameters) {
		const [key, value] = parameter

		requestParameters.push(`${key}=${value}`)
	}

	const finalPath =
		requestParameters.length > 0
			? `${path}?${requestParameters.join('&')}`
			: path

	const response = await api.get(finalPath, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	return NextResponse.json(response)
}
