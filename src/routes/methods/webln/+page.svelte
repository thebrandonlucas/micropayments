<script lang="ts">
	import { browser } from '$app/environment';
	import { requestProvider, type WebLNProvider } from 'webln';
	import Button from '$components/Button.svelte';
	import { onMount } from 'svelte';
	import Prize from '$features/Prize.svelte';

	let webln: WebLNProvider;
	let paid = false;

	async function enableWebln() {
		if (browser) {
			try {
				webln = await requestProvider();
			} catch (e) {
				console.error(e);
				alert(
					`Please enable WebLN for this site (try refreshing if you already rejected the connection)\n\n${e}`
				);
			}
		}
	}

	async function pay() {
		try {
			const result = await fetch('/api/invoice');
			const { payment_request } = await result.json();
			await webln.sendPayment(payment_request);
			paid = true;
		} catch (e) {
			console.error(e);
			alert('WebLN failed to make payment');
		}
	}

	$: enableWebln();

	// $: console.log({ webln, $paid });
</script>

<div class="flex flex-col gap-4 items-center justify-center">
	<Prize {paid} />
	{#if webln && !paid}
		<Button on:click={pay}>Pay with WebLN Provider</Button>
	{/if}
</div>
