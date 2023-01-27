import { json } from '@sveltejs/kit';
import { API_ENDPOINT, INVOICE_MACAROON } from '$env/static/private';
import { getLnd } from '../../../utils/lnd';
import { createInvoice } from 'lightning';

export async function GET() {
	const lnd = await getLnd(INVOICE_MACAROON, API_ENDPOINT);
	const { id, request } = await createInvoice({
		lnd,
		tokens: 21,
		description: "Reveal what's in the secret box"
	});
	return json({ id, request });
}
