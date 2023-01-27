<script lang="ts">
	import QRCode from 'qrcode';
	import Button from '../components/Button.svelte';

	const MAX_CHECK_ATTEMPTS = 10;

	let invoice: string;
	let paymentHash: string;
	let checkAttempts = 0;
	let error = '';
	let polling = false;

	export let paid: boolean;

	async function fetchInvoice() {
		try {
			const result = await fetch('/api/invoice');
			const { id, request } = await result.json();
			invoice = request;
			paymentHash = id;
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
	}

	async function pollForPayment() {
		if (paymentHash) {
			if (checkAttempts < MAX_CHECK_ATTEMPTS) {
				const result = await fetch('/api/checkpayment', {
					method: 'POST',
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({ paymentHash })
				});
				const { is_confirmed } = await result.json();
				if (is_confirmed) {
					paid = true;
					console.log('confirmed');
				} else {
					setTimeout(pollForPayment, 3000);
					checkAttempts++;
					console.log('attempt', checkAttempts);
				}
			} else if (checkAttempts > MAX_CHECK_ATTEMPTS) {
				checkAttempts = 0;
				error = 'Timeout, too many checks';
				polling = false;
			}
		}
	}

	function copy() {
		navigator.clipboard.writeText(invoice || '');
		setTimeout(() => {}, 4000);
	}

	$: fetchInvoice();
	$: invoice && createQRCode();
	$: polling && !paid && pollForPayment();
</script>

<div class="flex flex-col gap-4">
	{#if !paid}
		<canvas id="canvas" />
	{/if}
	{#if error}
		<p>{error}</p>
	{/if}
	{#if !invoice}
		<p>Loading...</p>
	{:else if !paid}
		<Button on:click={copy}>Copy Invoice</Button>
	{/if}
</div>
