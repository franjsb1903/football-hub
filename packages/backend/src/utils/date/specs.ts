import { getSpainDate } from './index'

describe('getSpainDate', () => {
	it('should return the date in YYYY-MM-DD format for Europe/Madrid timezone with year set to 2023', () => {
		const mockDate = new Date('2025-05-14T10:00:00Z')
		const originalDate = globalThis.Date
		globalThis.Date = jest.fn(() => mockDate) as any
		globalThis.Date.UTC = originalDate.UTC
		globalThis.Date.parse = originalDate.parse
		globalThis.Date.now = originalDate.now

		const spainDate = getSpainDate()

		expect(spainDate).toBe('2023-05-14')

		globalThis.Date = originalDate
	})
})
