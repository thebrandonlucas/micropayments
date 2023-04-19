<script lang="ts">
	import Button from '$components/Button.svelte';
	import Invoice from '$features/Invoice.svelte';
	import { paid } from '$stores/store';
	import type { LsatOptions } from 'lsat-js';
	import { onMount } from 'svelte';

	let value = 50;
	let invoice = '';
	let lsat: LsatOptions;

	async function createLsat() {
		// get lsat from api (generate invoice with permissions and expiration as num seconds Date.now() + paidForSeconds)
		try {
			// 402 payment required, token + invoice
			const result = await fetch('/api/lsat', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ value })
			});
			if (!result.ok) {
				const { error } = await result.json();
				throw new Error(`${result.status}: ${result.statusText} - ${error}`);
			}
			const data = (await result.json()) as { lsat: LsatOptions };
			const { lsat } = data;
			console.log({ lsat });
			invoice = lsat.invoice || '';
		} catch (e) {
			console.error(e);
			alert(String(e));
		}
		// pay invoice & get preimage
		// append preimage to token
		// add to localstorage
		// TODO store lsat in browser
	}

	async function saveLsat() {
		// Satisfy the lsat by
		// calling api to get preimage
		console.log(lsat);
		console.log({
			macaroon: lsat.baseMacaroon,
			paymentRequest: lsat.invoice,
			paymentHash: lsat.paymentHash
		});
		const result = await fetch('/api/satisfy', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				macaroon: lsat.baseMacaroon,
				paymentRequest: lsat.invoice,
				paymentHash: lsat.paymentHash
			})
		});
		if (!result.ok) {
			const { error } = await result.json();
			throw new Error(`${result.status}: ${result.statusText} - ${error}`);
		}
		lsat = (await result.json()) as LsatOptions;
		window.localStorage.setItem('secret-box-lsat', JSON.stringify(lsat));
	}

	function checkForToken() {
		// check localstorage for token
		// if no token, create LSAT and ask for payment
		createLsat();
		// check for expiration
		// if expired, tell them expired, delete token, tell them to pay again
		// else, show image
	}

	onMount(checkForToken);

	// FIXME: make more robust
	$: $paid && lsat && saveLsat();
</script>

<div class="flex flex-col gap-8 items-center">
	<div class="w-96">
		<p>
			<a href="https://lsat.tech/">LSAT</a> (or Lightning Service Authentication Token), is a
			specification that allows users to pay for "tickets" to access web resources. It utilizes the
			<a href="https://www.rfc-editor.org/rfc/rfc7231#section-6.5.2">forgotten error code</a>
			(402 Payment Required) together with a combination of macaroons and BOLT-11 invoices to indicate
			whether a user has access to a given resource.
		</p>
	</div>
	<Invoice {invoice} on:paid={() => paid.set(true)} />
	<div class="flex flex-col gap-4 w-60 justify-center">
		<p>Pay 1 sat per second of access</p>
		<label for="slider">{value} seconds of access (via LSAT)</label>
		<input name="slider" class="w-52" type="range" min="0" max="100" bind:value />
		<Button on:click={createLsat}>Pay</Button>
	</div>
</div>
