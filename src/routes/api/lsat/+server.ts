import { lndStore } from '$stores/store';
import { createInvoice } from 'lightning';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { get } from 'svelte/store';
import { getRawMacaroon, Identifier, Lsat } from 'lsat-js';
import Macaroon from 'macaroon';
import { ROOT_KEY } from '$env/static/private';

export const POST: RequestHandler = async function ({ request, url }) {
	try {
		const { value } = await request.json();
		// get an invoice
		const { id: paymentHash, request: paymentRequest } = await createInvoice({
			lnd: get(lndStore),
			tokens: value,
			description: "Reveal what's in the secret box"
		});
		// create LSAT from rootkey and paymentRequest
		const identifier = new Identifier({ paymentHash: Buffer.from(paymentHash, 'hex') });
		const macaroon = Macaroon.newMacaroon({
			version: 1,
			rootKey: ROOT_KEY,
			identifier: identifier.toString(),
			location: url.origin
		});
		const lsat = Lsat.fromMacaroon(getRawMacaroon(macaroon), paymentRequest);
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
