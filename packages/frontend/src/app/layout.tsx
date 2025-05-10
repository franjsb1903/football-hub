import './globals.css'
import React, { Suspense } from 'react'
import type { Metadata } from 'next'

import Loading from '../components/loading'
import MainLayout from '@/layouts/main-layout'

export const metadata: Metadata = {
	title: 'Football Hub',
	description: 'Revisa los resultados de tus equipos favoritos',
	icons: {
		icon: '/favicon.ico',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body style={{ margin: 0, padding: 0, minHeight: '100vh' }}>
				<Suspense fallback={<Loading />}>
					<MainLayout>
						<Suspense fallback={<Loading />}>{children}</Suspense>
					</MainLayout>
				</Suspense>
			</body>
		</html>
	)
}
