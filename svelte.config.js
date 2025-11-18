import adapter from '@sveltejs/adapter-static';

const dev = process.env.NODE_ENV !== 'production';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			fallback: '404.html', // GitHub Pages uses 404.html as SPA fallback
			strict: false // Allow mix of static and dynamic routes
		}),
		paths: {
			base: dev ? '' : '/NoCMS'
		},
		prerender: {
			origin: 'https://code-by-timo.github.io',
			handleHttpError: 'warn'
		}
	}
};

export default config;
