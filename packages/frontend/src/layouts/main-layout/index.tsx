'use client'
import { SessionProvider } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import Header from '@/views/header'

const MainLayout = ({ children }: { children: ReactNode }) => {
	const pathname = usePathname()

	return (
		<SessionProvider>
			{!pathname.includes('/login') &&
				!pathname.includes('/register') && <Header />}
			<main>{children}</main>
		</SessionProvider>
	)
}

export default MainLayout
