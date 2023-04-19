import type { AuthenticatedLnd } from 'lightning';
import { writable } from 'svelte/store';

export const lndStore = writable<AuthenticatedLnd>();
export const paid = writable(false);
