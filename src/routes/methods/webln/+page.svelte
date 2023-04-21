<script lang="ts">
	import { browser } from '$app/environment';
	import { requestProvider, type WebLNProvider } from 'webln';
	import Button from '$components/Button.svelte';
	import { paid } from '$stores/store';

	let webln: WebLNProvider;

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
			paid.set(true);
		} catch (e) {
			console.error(e);
			alert('WebLN failed to make payment');
		}
	}

	$: enableWebln();
</script>

{#if webln && !$paid}
	<div class="flex justify-center">
		<Button on:click={pay}>Pay with WebLN Provider</Button>
	</div>
{/if}
