<script>
	import { paid } from '$stores/store';
	import '../app.css';
</script>

<main class="flex flex-col gap-4 mx-auto w-1/2 my-6">
	<header class="flex flex-col gap-4 text-center mb-10 items-center">
		<a href="/"><h1 class="text-3xl">Micropayments</h1></a>
		{#if $paid}
			<p>Payment successful!</p>
			<img src="/images/secret_string.jpg" alt="A secret string!" />
		{:else}
			<p>Pay with lightning to see what's in the box!</p>
			<img class="w-96" src="/images/secret_box.jpg" alt="Pay the invoice to reveal the secret!" />
		{/if}
	</header>
	<slot />
</main>
