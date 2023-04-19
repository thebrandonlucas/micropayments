import { authenticatedLndGrpc, type AuthenticatedLnd } from 'lightning';

export async function getLnd(socket: string, macaroon: string) {
	const { lnd }: { lnd: AuthenticatedLnd } = authenticatedLndGrpc({
		socket,
		macaroon
	});
	return lnd;
}
