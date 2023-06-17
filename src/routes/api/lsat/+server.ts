import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getRawMacaroon, Identifier, Lsat } from 'lsat-js';
import Macaroon from 'macaroon';
import { ROOT_KEY } from '$env/static/private';
import { addInvoice } from '$utils/fetch';

export const POST: RequestHandler = async function ({ request, url }) {
	try {
		const { value } = await request.json();
		// get an invoice
		const res = await addInvoice(value, 'LSAT payment!');
		const { r_hash, payment_request } = res?.data || {};
		// create LSAT from rootkey and paymentRequest
		const identifier = new Identifier({ paymentHash: Buffer.from(r_hash, 'hex') });
		const macaroon = Macaroon.newMacaroon({
			version: 1,
			rootKey: ROOT_KEY,
			identifier: identifier.toString(),
			location: url.origin
		});
		const lsat = Lsat.fromMacaroon(getRawMacaroon(macaroon), payment_request);
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
