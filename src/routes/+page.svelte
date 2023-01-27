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
	let paid = false;

	function setPagePaymentMethod(method: PaymentMethod) {
		if (browser) {
			const url = new URL($page.url);
			url.searchParams.set('method', method);
			goto(url, { replaceState: true });
		}
	}

	$: setPagePaymentMethod(selectedPaymentMethod);
</script>

<header class="flex flex-col gap-4 text-center mb-10">
	<h1 class="text-3xl">Micropayments</h1>
	<p>Pay with lightning to see what's in the box!</p>
</header>

<article class="flex flex-col gap-4">
	<section class="flex justify-center">
		{#if !paid}
			<img class="w-96" src="secret_box.jpg" alt="Pay the invoice to reveal the secret!" />
		{:else}
			<img src="secret_string.jpg" alt="A secret string!" />
		{/if}
	</section>
	<section class="flex justify-center">
		{#if selectedPaymentMethod === 'invoice'}
			<Invoice bind:paid />
		{:else if selectedPaymentMethod === 'lsat'}
			<Lsat />
		{:else if selectedPaymentMethod === 'webln'}
			<Webln bind:paid />
		{:else if selectedPaymentMethod === 'keysend'}
			<Keysend />
		{/if}
	</section>
	<section class="flex justify-center gap-4">
		{#each PAYMENT_METHOD as { title, method }}
			<Button
				secondary={method !== selectedPaymentMethod}
				on:click={() => {
					paid = false;
					selectedPaymentMethod = method;
				}}>{title}</Button>
		{/each}
	</section>
</article>
