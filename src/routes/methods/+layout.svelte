<script lang="ts">
	import Button from '../../components/Button.svelte';
</script>

<section>
	<slot />
</section>
<section class="flex justify-center gap-4">
	<a href="invoice"><Button>Invoice</Button></a>
	<a href="lsat"><Button>LSAT</Button></a>
	<a href="webln"><Button>WebLN</Button></a>
	<!-- <a href="keysend"><Button on:click={resetPaid}>Keysend</Button></a> -->
</section>
