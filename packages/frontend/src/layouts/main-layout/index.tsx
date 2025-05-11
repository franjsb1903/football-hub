'use client'
import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

const MainLayout = ({ children }: { children: ReactNode }) => {
	return (
		<SessionProvider>
			<main>{children}</main>
		</SessionProvider>
	)
}

export default MainLayout
