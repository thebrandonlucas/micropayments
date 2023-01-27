import { authenticatedLndGrpc, type AuthenticatedLnd, getInvoice } from 'lightning';

export function getLnd(macaroon: string, socket: string) {
	const { lnd }: { lnd: AuthenticatedLnd } = authenticatedLndGrpc({
		macaroon,
		socket
	});
	return lnd;
}

export async function checkPayment(payment_hash: string, lnd: AuthenticatedLnd) {
	const { is_confirmed } = await getInvoice({
		id: payment_hash,
		lnd
	});
	return is_confirmed;
}
