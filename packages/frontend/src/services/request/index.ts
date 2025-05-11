import Fetcher from '@/utils/fetcher'

export const api = {
	host: process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4321',
	path: process.env.NEXT_PUBLIC_API_PATH || '/api',
}

export class API extends Fetcher {
	private static instance: API

	private constructor() {
		super(api.host, api.path)
	}

	public static getInstance() {
		API.instance ||= new API()

		return API.instance
	}
}

export default API.getInstance()
