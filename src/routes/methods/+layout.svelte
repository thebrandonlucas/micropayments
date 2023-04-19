<script lang="ts">
	import { paid } from '$stores/store';
	import Button from '../../components/Button.svelte';
</script>

<section class="flex justify-center">
	{#if !$paid}
		<img class="w-96" src="/images/secret_box.jpg" alt="Pay the invoice to reveal the secret!" />
	{:else}
		<img src="/images/secret_string.jpg" alt="A secret string!" />
	{/if}
</section>
<section>
	<slot />
</section>
<section class="flex justify-center gap-4">
	<a href="invoice"><Button>Invoice</Button></a>
	<a href="lsat"><Button>LSAT</Button></a>
	<a href="webln"><Button>WebLN</Button></a>
	<a href="keysend"><Button>Keysend</Button></a>
</section>
