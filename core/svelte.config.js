import adapterVercel from '@sveltejs/adapter-vercel';
import adapterStatic from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: (() => {
			console.log("process.env.VERCEL:", process.env.VERCEL)
			if (process.env.VERCEL) {
				return adapterVercel();
			} else {
				return adapterStatic({
					pages: 'build',
					assets: 'build',
          			fallback: null,
          			precompress: false,
          			strict: true
				});
			}
		}) () 
	}
};

export default config;
