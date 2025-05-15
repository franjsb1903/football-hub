// packages/frontend/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['media.api-sports.io'],
		unoptimized: true,
	},
}

module.exports = nextConfig
