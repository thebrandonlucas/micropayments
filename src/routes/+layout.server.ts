import { API_ENDPOINT, MACAROON, ROOT_KEY } from '$env/static/private';
import { error } from '@sveltejs/kit';

export async function load() {
	const missing: string[] = [];
	if (!API_ENDPOINT) {
		missing.push('API_ENDPOINT');
	}
	if (!MACAROON) {
		missing.push('MACAROON');
	}
	if (!ROOT_KEY) {
		missing.push('ROOT_KEY');
	}
	if (missing.length) {
		throw error(500, `Not all .env vars are set! Missing: ${missing.join(', ')}`);
	}
}
