'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function Teams() {
	const { status } = useSession()

	if (status === 'unauthenticated') {
		return redirect('/login')
	}

	return (
		<div>
			<h1>Teams</h1>
			<p>List of teams</p>
		</div>
	)
}
