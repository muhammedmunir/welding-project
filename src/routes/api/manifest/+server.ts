import type { RequestHandler } from './$types';

const BASE = {
	name: 'Syarah & Munir 2026',
	short_name: 'S×M 2026',
	description: 'Jemputan digital majlis perkahwinan Zulfatul Syarah & Muhammed Munir',
	display: 'standalone',
	background_color: '#6b21a8',
	theme_color: '#c084be',
	orientation: 'portrait',
	lang: 'ms',
	icons: [
		{ src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
		{ src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
		{ src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
		{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }
	],
	screenshots: [],
	categories: ['lifestyle', 'social']
};

export const GET: RequestHandler = ({ url }) => {
	const start = url.searchParams.get('start') || '/';

	// Hanya benarkan path yang sah — elak open redirect
	const allowed = /^\/[a-zA-Z0-9\-_/]*$/;
	const startUrl = allowed.test(start) ? start : '/';

	return new Response(JSON.stringify({ ...BASE, start_url: startUrl }), {
		headers: {
			'Content-Type': 'application/manifest+json',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
