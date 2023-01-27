<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import Button from '../components/Button.svelte';

	import Invoice from '../features/Invoice.svelte';
	import Keysend from '../features/Keysend.svelte';
	import Lsat from '../features/Lsat.svelte';
	import Webln from '../features/Webln.svelte';

	const PAYMENT_METHOD: Array<{ title: string; method: PaymentMethod }> = [
		{
			title: 'Invoice',
			method: 'invoice'
		},
		{
			title: 'LSAT',
			method: 'lsat'
		},
		{
			title: 'WebLN',
			method: 'webln'
		},
		{
			title: 'Keysend',
			method: 'keysend'
		}
	];

	type PaymentMethod = 'invoice' | 'lsat' | 'webln' | 'keysend';

	let selectedPaymentMethod: PaymentMethod = ($page.params.method as PaymentMethod) || 'invoice';

	function setPagePaymentMethod(method: PaymentMethod) {
		if (browser) {
			const url = new URL($page.url);
			url.searchParams.set('method', method);
			goto(url, { replaceState: true });
		}
	}

	$: setPagePaymentMethod(selectedPaymentMethod);

	onMount(() => {
		const url = new URL(window.location.href);
		console.log(url.searchParams);
		console.log($page.params, window.location.href);
		// setPagePaymentMethod('invoice');
	});
</script>

<header class="flex flex-col gap-4 text-center mb-10">
	<h1 class="text-3xl">Micropayments</h1>
	<p>Pay with lightning to see what's in the box!</p>
</header>

<article class="flex flex-col gap-4">
	<section class="flex justify-center gap-4">
		{#each PAYMENT_METHOD as { title, method }}
			<Button
				secondary={method !== selectedPaymentMethod}
				on:click={() => {
					selectedPaymentMethod = method;
				}}>{title}</Button>
		{/each}
	</section>
	<section class="flex justify-center">
		<img class="w-96" src="secret_box.jpg" alt="Pay the invoice to reveal the secret!" />
	</section>
	<section>
		{#if selectedPaymentMethod === 'invoice'}
			<Invoice />
		{:else if selectedPaymentMethod === 'lsat'}
			<Lsat />
		{:else if selectedPaymentMethod === 'webln'}
			<Webln />
		{:else if selectedPaymentMethod === 'keysend'}
			<Keysend />
		{/if}
	</section>
</article>
