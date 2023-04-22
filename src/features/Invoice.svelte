<script lang="ts">
	import QRCode from 'qrcode';
	import Button from '$components/Button.svelte';
	import { onDestroy, onMount } from 'svelte';

	const MAX_CHECK_ATTEMPTS = 10;

	let paymentHash: string;
	let checkAttempts = 0;
	let error = '';
	let polling = false;
	let copyInterval: NodeJS.Timeout;
	let pollInterval: NodeJS.Timeout;

	export let invoice: string = '';
	export let paid = false;

	async function fetchInvoice() {
		try {
			const result = await fetch('/api/invoice');
			const { r_hash, payment_request } = await result.json();
			invoice = payment_request;
			paymentHash = r_hash;
		} catch (e) {
			console.error(e);
			alert(e);
		}
	}

	function createQRCode() {
		const canvas = document.getElementById('canvas');
		QRCode.toCanvas(canvas, invoice as string, (error: unknown) => {
			if (error) console.error(error);
			console.log('Generated QRCode');
		});
		polling = true;
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
					paid = true;
					console.log('PAID');
				} else {
					pollInterval = setTimeout(pollForPayment, 3000);
					checkAttempts++;
					console.log('NOT PAID');
				}
			} else if (checkAttempts > MAX_CHECK_ATTEMPTS) {
				checkAttempts = 0;
				error = 'Timeout, too many checks';
				polling = false;
				invoice = '';
				console.log('CHECKING');
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
	$: polling && !paid && pollForPayment();
</script>

<div class="flex flex-col gap-4 items-center">
	{#if !paid}
		<canvas id="canvas" />
	{/if}
	{#if error}
		<p>{error}</p>
	{/if}
	{#if !invoice && !paid}
		<p>Loading...</p>
	{:else if !paid}
		<Button on:click={copy}>Copy Invoice</Button>
	{/if}
</div>
