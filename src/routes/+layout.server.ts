import { API_ENDPOINT, MACAROON } from '$env/static/private';
import { error } from '@sveltejs/kit';

export async function load() {
	const missing: string[] = [];
	if (!API_ENDPOINT) {
		missing.push('API_ENDPOINT');
	}
	if (!MACAROON) {
		missing.push('MACAROON');
	}
	if (missing.length) {
		throw error(500, `Not all .env vars are set! Missing: ${missing.join(', ')}`);
	}
}
