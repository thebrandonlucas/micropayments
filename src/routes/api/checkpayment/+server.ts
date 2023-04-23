import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { lookupInvoice } from '$utils/fetch';

export const POST: RequestHandler = async function ({ request }): Promise<Response> {
	const { paymentHash } = await request.json();
	try {
		// Depending on LND version, you will either need to pass paymentHash as hex or base64 here
		// https://lightning.engineering/api-docs/api/lnd/lightning/lookup-invoice#:~:text=The-,hex%2Dencoded,-payment%20hash%20of
		const hexPaymentHash = Buffer.from(paymentHash, 'base64').toString('hex');
		const { data } = (await lookupInvoice(hexPaymentHash)) || {};
		return json({ settled: data.settled });
	} catch (e) {
		const err = e as Error;
		console.error(err.message);
		throw error(500, err.message);
	}
};
