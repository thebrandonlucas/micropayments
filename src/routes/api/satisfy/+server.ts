import type { RequestHandler } from './$types';
import { getRawMacaroon, Lsat } from 'lsat-js';
import { get } from 'svelte/store';
import { json } from '@sveltejs/kit';
import { lookupInvoice } from '$utils/fetch';

export const POST: RequestHandler = async function ({ request }) {
	try {
		const { macaroon, paymentRequest, paymentHash } = await request.json();
		const lsat = Lsat.fromMacaroon(getRawMacaroon(macaroon), paymentRequest);
		// satisfy lsat by checking if paid
		const { data } = (await lookupInvoice(paymentHash)) || {};
		lsat.setPreimage(data.r_preimage);
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
