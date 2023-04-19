<script lang="ts">
	import { browser } from '$app/environment';
	import { requestProvider, type WebLNProvider } from 'webln';
	import Button from '$components/Button.svelte';

	let webln: WebLNProvider;
	export let paid: boolean;

	async function enableWebln() {
		if (browser) {
			try {
				webln = await requestProvider();
			} catch (e) {
				console.error(e);
			}
		}
	}

	async function pay() {
		try {
			const result = await fetch('/api/invoice');
			const { request } = await result.json();
			const data = await webln.sendPayment(request);
			console.log({ data });
			paid = true;
		} catch (e) {
			alert('WebLN failed to make payment');
			console.error(e);
		}
	}

	$: enableWebln();
</script>

{#if webln && !paid}
	<Button on:click={pay}>Pay with WebLN Provider</Button>
{/if}
