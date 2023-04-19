import { lndStore } from '../../../stores/store';
import { json } from '@sveltejs/kit';
import { getInvoice } from 'lightning';
import { get } from 'svelte/store';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async function ({ request }): Promise<Response> {
	const { paymentHash } = await request.json();
	const { is_confirmed } = await getInvoice({
		id: paymentHash,
		lnd: get(lndStore)
	});
	return json({ is_confirmed });
};
