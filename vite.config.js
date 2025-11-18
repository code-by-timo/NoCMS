import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';
import { generatePagesPlugin } from './scripts/vite-plugin-generate-pages.js';

export default defineConfig({
	plugins: [generatePagesPlugin(), enhancedImages(), tailwindcss(), sveltekit()]
});
