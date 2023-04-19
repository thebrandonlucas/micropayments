<script lang="ts">
	import { longPoll } from '$utils/poll';
	import { onDestroy } from 'svelte';

	export let callback: (...args: unknown[]) => unknown;
	export let everySeconds: number;

	let interval: NodeJS.Timeout;

	onDestroy(() => clearTimeout(interval));

	$: longPoll(callback, everySeconds);
</script>

<slot />
