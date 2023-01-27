import { json } from '@sveltejs/kit';
import { API_ENDPOINT, INVOICE_MACAROON } from '$env/static/private';
import { getLnd } from '../../../utils/lnd';
import { getInvoice } from 'lightning';
import type { RequestHandler } from './$types';

export async function POST({ request }): Promise<RequestHandler> {
	const { paymentHash } = await request.json();
	const lnd = await getLnd(INVOICE_MACAROON, API_ENDPOINT);
	const { is_confirmed } = await getInvoice({
		id: paymentHash,
		lnd
	});
	return json({ is_confirmed });
}
