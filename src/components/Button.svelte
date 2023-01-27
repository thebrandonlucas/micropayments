<script lang="ts">
	export let secondary = false;
</script>

<button class:secondary on:click>
	<slot />
</button>

<style>
	button {
		@apply p-3 rounded-md bg-green-500;
		@apply transition-all duration-200;
		@apply border-white border-2;
	}
	button:hover {
		@apply bg-green-600;
	}
	.secondary {
		@apply bg-transparent;
	}
</style>
