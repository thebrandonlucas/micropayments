<script>
	import Invoice from '$features/Invoice.svelte';
	import Prize from '$features/Prize.svelte';

	$: paid = false;
</script>

<div class="flex flex-col gap-4 justify-center">
	<Prize {paid} />
	<Invoice bind:paid />
</div>
