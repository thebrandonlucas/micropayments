import { authenticatedLndGrpc, type AuthenticatedLnd } from 'lightning';

export function getLnd(macaroon: string, socket: string) {
	const { lnd }: { lnd: AuthenticatedLnd } = authenticatedLndGrpc({
		macaroon,
		socket
	});
	return lnd;
}
