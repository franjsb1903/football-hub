import { NextRequest, NextResponse } from 'next/server'

import api from '@/services/api'

export async function GET(
	request: NextRequest,
	{ params }: { params: { path: string | string[] } },
) {
	const token = request.headers.get('Authorization')?.split(' ')[1]
	const { path } = await params

	const urlPath = Array.isArray(path) ? path.join('/') : path
	console.log({ urlPath })
	const searchParameters = request.nextUrl.searchParams

	const parameters = searchParameters.entries()
	const requestParameters = buildParameters(parameters)

	const finalPath = buildFinalPath(requestParameters, urlPath)
	try {
		const response = await api.get(finalPath, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		return NextResponse.json(response)
	} catch (error: any) {
		return handleError(error)
	}
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
	try {
		const response = await api.post(finalPath, body, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		return NextResponse.json(response)
	} catch (error) {
		return handleError(error)
	}
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
	try {
		const response = await api.delete(finalPath, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		return NextResponse.json(response)
	} catch (error) {
		return handleError(error)
	}
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

function handleError(error: any) {
	console.error('Error en la llamada a la API externa:', error)

	let errorMessage = 'Ha ocurrido un error inesperado.'
	let statusCode = 500

	if (error.response) {
		errorMessage =
			error.response.data?.message || error.response.data || error.message
		statusCode = error.response.status
	} else if (error.request) {
		errorMessage = 'No se recibió respuesta del servidor externo.'
		statusCode = 503
	} else if (error.message === 'Unauthorized') {
		errorMessage = 'Unauthorized'
		statusCode = 401
	} else {
		errorMessage = error.message
		statusCode = 500
	}

	return NextResponse.json({ message: errorMessage }, { status: statusCode })
}
