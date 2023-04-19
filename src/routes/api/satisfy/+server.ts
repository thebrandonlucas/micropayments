import type { RequestHandler } from './$types';
import { getRawMacaroon, Lsat } from 'lsat-js';
import { getInvoice } from 'lightning';
import { lndStore } from '$stores/store';
import { get } from 'svelte/store';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async function ({ request }) {
	try {
		console.log('aw', await request.json());
		const { macaroon, paymentRequest, paymentHash } = await request.json();
		const lsat = Lsat.fromMacaroon(getRawMacaroon(macaroon), paymentRequest);
		// satisfy lsat by checking if paid
		const { secret } = await getInvoice({
			id: paymentHash,
			lnd: get(lndStore)
		});
		lsat.setPreimage(secret);

		return json({ lsat: lsat.toJSON() });
	} catch (e) {
		return json(
			{
				error: (e as Error)?.message
			},
			{ status: 500 }
		);
	}
};
