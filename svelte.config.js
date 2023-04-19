import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$components: './src/components',
			'$components/*': './src/components/*',
			$features: './src/features',
			'$features/*': './src/features/*',
			$utils: './src/utils',
			'$utils/*': './src/utils/*',
			$stores: './src/stores',
			'$stores/*': './src/stores/*'
		}
	}
};

export default config;
