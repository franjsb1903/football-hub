import { NextRequest, NextResponse } from 'next/server'

import api from '@/services/api'

export async function GET(
	request: NextRequest,
	{ params }: { params: { path: string | string[] } },
) {
	const token = request.headers.get('Authorization')?.split(' ')[1]
	const { path } = await params

	const urlPath = Array.isArray(path) ? path.join('/') : path
	const searchParameters = request.nextUrl.searchParams

	const parameters = searchParameters.entries()
	const requestParameters = buildParameters(parameters)

	const finalPath = buildFinalPath(requestParameters, urlPath)

	const response = await api.get(finalPath, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	return NextResponse.json(response)
}

export async function POST(
	request: NextRequest,
	{ params }: { params: { path: string | string[] } },
) {
	const body = await request.json()
	const token = request.headers.get('Authorization')?.split(' ')[1]
	const { path } = await params

	const urlPath = Array.isArray(path) ? path.join('/') : path
	const searchParameters = request.nextUrl.searchParams

	const parameters = searchParameters.entries()
	const requestParameters = buildParameters(parameters)

	const finalPath = buildFinalPath(requestParameters, urlPath)

	const response = await api.post(finalPath, body, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	return NextResponse.json(response)
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { path: string | string[] } },
) {
	const token = request.headers.get('Authorization')?.split(' ')[1]
	const { path } = await params

	const urlPath = Array.isArray(path) ? path.join('/') : path
	const searchParameters = request.nextUrl.searchParams

	const parameters = searchParameters.entries()
	const requestParameters = buildParameters(parameters)

	const finalPath = buildFinalPath(requestParameters, urlPath)

	const response = await api.delete(finalPath, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	return NextResponse.json(response)
}

function buildParameters(
	parameters: URLSearchParamsIterator<[string, string]>,
) {
	const requestParameters = []

	for (const parameter of parameters) {
		const [key, value] = parameter

		requestParameters.push(`${key}=${value}`)
	}

	return requestParameters
}

function buildFinalPath(requestParameters: string[], urlPath: string) {
	return requestParameters.length > 0
		? `${urlPath}?${requestParameters.join('&')}`
		: urlPath
}
