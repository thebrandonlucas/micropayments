<script lang="ts">
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';

	// TODO: generate invoice
	let invoice = '';

	onMount(async () => {
		const canvas = document.getElementById('canvas');
		QRCode.toCanvas(canvas, invoice as string, (error: unknown) => {
			if (error) console.error(error);
			console.log('Generated QRCode');
		});

		const res = await (await fetch('/api/invoice')).json();
		console.log({ res });
	});
</script>

<canvas id="canvas" />
