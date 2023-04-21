import { json } from '@sveltejs/kit';
import { addInvoice } from '$utils/fetch';
import { error } from '@sveltejs/kit';

export async function GET() {
	try {
		const res = await addInvoice(21, "Reveal what's in the secret box!");
		const { r_hash, payment_request } = res?.data || {};
		return json({ r_hash, payment_request });
	} catch (e) {
		const err = e as Error;
		console.error(err.message);
		throw error(500, err.message);
	}
}
