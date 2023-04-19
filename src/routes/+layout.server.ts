import { API_ENDPOINT, MACAROON } from '$env/static/private';
import { getLnd } from '$utils/lnd';
import { lndStore } from '../stores/store';

export async function load() {
	const lnd = await getLnd(API_ENDPOINT, MACAROON);
	lndStore.set(lnd);
}
