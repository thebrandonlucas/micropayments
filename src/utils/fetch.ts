import { API_ENDPOINT, MACAROON } from '$env/static/private';
import axios from 'axios';
import https from 'https';

// LND API: https://lightning.engineering/api-docs/api/lnd/
const node = axios.create({
	baseURL: API_ENDPOINT,
	httpsAgent: new https.Agent({
		rejectUnauthorized: false
	}),
	headers: { 'Grpc-Metadata-Macaroon': MACAROON }
});

export async function fetch(url: string, body?: Record<string, unknown>) {
	try {
		const res = body ? node.post(url, body) : node.get(url);
		return res;
	} catch (e) {
		const error = e as Error;
		console.error(error.message);
	}
}

export async function getInfo() {
	return fetch('/v1/getinfo');
}

export async function addInvoice(value: number, memo = '') {
	return fetch('/v1/invoices', { value, memo });
}

export async function lookupInvoice(paymentHash: string) {
	return fetch(`/v1/invoice/${paymentHash}`);
}
