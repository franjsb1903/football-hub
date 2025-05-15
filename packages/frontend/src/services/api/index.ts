import Fetcher from '@/utils/fetcher'

export const api = {
	host: process.env.BACKEND_API_HOST || 'http://localhost:3000',
	path: process.env.BACKEND_API_PATH || '',
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
