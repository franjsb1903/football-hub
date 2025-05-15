import { signOut } from 'next-auth/react'

import type { RequestOptions } from './types'

export default class Fetcher {
	private headers = { 'Content-Type': 'application/json' }

	private readonly host: string
	private readonly path: string = ''

	constructor(host: string, path = '') {
		this.host = host
		this.path = path
	}

	public async get<ResponseData>(
		path: string,
		options?: RequestOptions,
	): Promise<ResponseData | undefined> {
		return await this.request<undefined, ResponseData>(path, undefined, {
			...options,
			method: 'GET',
		})
	}

	public async post<RequestData, ResponseData = undefined>(
		path: string,
		data: RequestData,
		options?: RequestOptions,
	): Promise<ResponseData | undefined> {
		return await this.request<RequestData, ResponseData>(
			path,
			data,
			options,
		)
	}

	public async put<RequestData, ResponseData = undefined>(
		path: string,
		data: RequestData,
		options?: RequestOptions,
	): Promise<ResponseData | undefined> {
		return await this.request<RequestData, ResponseData>(path, data, {
			...options,
			method: 'PUT',
		})
	}

	public async delete(
		path: string,
		options?: RequestOptions,
	): Promise<undefined> {
		return await this.request<undefined, undefined>(path, undefined, {
			...options,
			method: 'DELETE',
		})
	}

	public async request<RequestData = unknown, ResponseData = unknown>(
		path: string,
		data?: RequestData,
		options?: RequestOptions,
	): Promise<ResponseData | undefined> {
		const url = this.getUrl(path).toString()
		const response = await fetch(url, {
			method: options?.method || (data ? 'POST' : 'GET'),
			headers: this.getHeaders(options?.headers),
			body: this.getRequestBody(data),
			signal: options?.signal,
		})

		return await this.getResponseBody(response)
	}

	private getHeaders(headers?: HeadersInit): Headers {
		if (headers) {
			return new Headers({ ...this.headers, ...headers })
		}

		return new Headers(this.headers)
	}

	private getUrl(path: string): URL {
		return new URL(`${this.path}/${path}`, this.host)
	}

	private getRequestBody(data: unknown): string | undefined {
		return data ? JSON.stringify(data) : undefined
	}

	private async getResponseBody<ResponseData = unknown>(
		response: Response,
	): Promise<ResponseData | undefined> {
		try {
			const isJsonResponse = response.headers
				.get('content-type')
				?.includes('application/json')
			const data = isJsonResponse
				? await response.json()
				: await response.text()

			if (response.status === 401) {
				localStorage.setItem(
					'sessionExpiredNotification',
					JSON.stringify({
						type: 'error',
						description: 'Sesión caducada',
						message:
							'Tu sesión ha caducado, por favor inicia sesión nuevamente',
					}),
				)
				localStorage.removeItem('access_token')
				localStorage.removeItem('alerts_meta')
				localStorage.removeItem('campaigns_meta')
				return signOut({ callbackUrl: '/login' })
			}

			if (!response.ok) {
				throw new Error(response.statusText)
			}

			return data
		} catch {
			throw new Error(response?.statusText ?? 'Malformed response', {
				cause: response.status,
			})
		}
	}
}
