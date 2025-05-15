'use client'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
	const router = useRouter()
	return (
		<main className="flex flex-col gap-8 items-center justify-center h-56">
			<h1 className="text-xl font-bold">No se ha encontrado la página</h1>
			<Button onClick={() => router.push('/login')}>
				Volver al inicio
			</Button>
		</main>
	)
}
