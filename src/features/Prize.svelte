<script lang="ts">
	export let paid = false;
</script>

<div class="flex flex-col gap-4 items-center">
	{#if paid}
		<p>Payment successful!</p>
		<img src="/images/secret_string.jpg" alt="A secret string!" />
	{:else if !paid}
		<p>Pay with lightning to see what's in the box!</p>
		<img class="w-96" src="/images/secret_box.jpg" alt="Pay the invoice to reveal the secret!" />
	{/if}
</div>
