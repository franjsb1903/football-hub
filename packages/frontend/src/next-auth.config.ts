/* eslint-disable no-unused-vars */

import type { DefaultSession, DefaultUser, NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import api from './services/api'

declare module 'next-auth' {
	interface User extends DefaultUser {
		accessToken?: string
		id?: string
		favouriteTeams?: string[]
	}

	interface Session extends DefaultSession {
		accessToken?: string
		user?: {
			id?: string
			favouriteTeams?: string[]
		} & DefaultSession['user']
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken?: string
		id?: string
		favouriteTeams?: string[]
	}
}

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: {
					label: 'Email',
					type: 'text',
					placeholder: 'Email',
				},
				password: { label: 'Contraseña', type: 'password' },
			},
			async authorize(credentials) {
				try {
					const response = (await api.post('auth/login', {
						email: credentials?.email,
						password: credentials?.password,
					})) as any

					if (!response?.accessToken)
						throw new Error('Credenciales incorrectas')

					// eslint-disable-next-line unicorn/no-null
					if (!response?.user) return null

					return {
						id: response.user.id,
						email: response.user.email,
						name: response.user.name,
						favouriteTeams: response.user.favoriteTeams,
						accessToken: response.accessToken,
					}
				} catch (error) {
					console.error('Error in authorize:', error)
					if (error instanceof Error) {
						throw new TypeError(
							error.message || 'Error in authorize',
						)
					}
					throw new Error('Error in authorize')
				}
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id
				token.accessToken = user.accessToken
				token.favouriteTeams = user.favouriteTeams
			}
			return token
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id
				session.user.favouriteTeams = token.favouriteTeams
			}
			session.accessToken = token.accessToken
			return session
		},
	},
	pages: {
		signIn: '/login',
	},
}
