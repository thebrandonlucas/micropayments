import { json } from '@sveltejs/kit';
import { createInvoice } from 'lightning';
import { get } from 'svelte/store';
import { lndStore } from '$stores/store';

export async function GET() {
	const { id, request } = await createInvoice({
		lnd: get(lndStore),
		tokens: 21,
		description: "Reveal what's in the secret box"
	});
	return json({ id, request });
}
