/** @type {import('tailwindcss').Config} */
export const content = [
	'./app/**/*.{js,ts,jsx,tsx,mdx}', // Para el App Router de Next.js
	'./pages/**/*.{js,ts,jsx,tsx,mdx}', // Si usas el Pages Router o tienes rutas antiguas
	'./components/**/*.{js,ts,jsx,tsx,mdx}',
	'./src/**/*.{js,ts,jsx,tsx,mdx}', // Si tienes un directorio src
]
export const theme = {
	extend: {},
}
export const plugins = []
