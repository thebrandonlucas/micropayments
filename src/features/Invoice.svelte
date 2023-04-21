<script lang="ts">
	import QRCode from 'qrcode';
	import Button from '$components/Button.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { paid } from '$stores/store';

	const MAX_CHECK_ATTEMPTS = 10;

	let paymentHash: string;
	let checkAttempts = 0;
	let error = '';
	let polling = false;
	let copyInterval: NodeJS.Timeout;
	let pollInterval: NodeJS.Timeout;

	export let invoice: string = '';

	async function fetchInvoice() {
		try {
			const result = await fetch('/api/invoice');
			const { r_hash, payment_request } = await result.json();
			invoice = payment_request;
			paymentHash = r_hash;
		} catch (e) {
			console.error(e);
		}
	}

	function createQRCode() {
		const canvas = document.getElementById('canvas');
		QRCode.toCanvas(canvas, invoice as string, (error: unknown) => {
			if (error) console.error(error);
			console.log('Generated QRCode');
		});
		polling = true;
		console.log({ polling });
	}

	async function pollForPayment() {
		if (paymentHash) {
			if (checkAttempts < MAX_CHECK_ATTEMPTS) {
				const result = await fetch('/api/checkpayment', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ paymentHash })
				});

				const { settled } = await result.json();
				if (settled) {
					invoice = '';
					paid.set(true);
				} else {
					pollInterval = setTimeout(pollForPayment, 3000);
					checkAttempts++;
				}
			} else if (checkAttempts > MAX_CHECK_ATTEMPTS) {
				checkAttempts = 0;
				error = 'Timeout, too many checks';
				polling = false;
				invoice = '';
			}
		}
	}

	function copy() {
		navigator.clipboard.writeText(invoice || '');
		copyInterval = setTimeout(() => {}, 4000);
	}

	onDestroy(() => clearTimeout(pollInterval));

	onMount(fetchInvoice);
	$: invoice && createQRCode();
	$: polling && !$paid && pollForPayment();
</script>

<div class="flex flex-col gap-4">
	{#if !$paid}
		<canvas id="canvas" />
	{/if}
	{#if error}
		<p>{error}</p>
	{/if}
	{#if !$paid && !invoice}
		<p>Loading...</p>
	{:else if !$paid}
		<Button on:click={copy}>Copy Invoice</Button>
	{/if}
</div>
