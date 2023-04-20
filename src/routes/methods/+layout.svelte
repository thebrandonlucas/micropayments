<script lang="ts">
	import { paid } from '$stores/store';
	import Button from '../../components/Button.svelte';

	function resetPaid() {
		paid.set(false);
	}
</script>

<section>
	<slot />
</section>
<section class="flex justify-center gap-4">
	<a href="invoice"><Button on:click={resetPaid}>Invoice</Button></a>
	<!-- <a href="lsat"><Button on:click={resetPaid}>LSAT</Button></a> -->
	<a href="webln"><Button on:click={resetPaid}>WebLN</Button></a>
	<!-- <a href="keysend"><Button on:click={resetPaid}>Keysend</Button></a> -->
</section>
