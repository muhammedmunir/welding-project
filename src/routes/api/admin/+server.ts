import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { password } = await request.json();

	const adminPassword = env.ADMIN_PASSWORD;

	if (!adminPassword) {
		// Jika ADMIN_PASSWORD tidak dikonfigurasi, tolak akses
		return json({ ok: false, error: 'Admin tidak dikonfigurasi.' }, { status: 503 });
	}

	const ok = password === adminPassword;
	return json({ ok });
};
