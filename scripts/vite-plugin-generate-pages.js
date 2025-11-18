/**
 * Vite Plugin: Auto-generate pages from pages.json during development
 * Watches pages.json for changes and regenerates page files automatically
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function generatePagesPlugin() {
	let isGenerating = false;

	/**
	 * Execute the generate-pages.js script
	 */
	function generatePages() {
		if (isGenerating) {
			console.log('⏳ Page generation already in progress, skipping...');
			return;
		}

		isGenerating = true;
		console.log('\n🔄 Regenerating pages from pages.json...');

		const scriptPath = path.join(__dirname, 'generate-pages.js');
		const child = spawn('node', [scriptPath], {
			stdio: 'inherit',
			shell: true
		});

		child.on('close', (code) => {
			isGenerating = false;
			if (code === 0) {
				console.log('✅ Pages regenerated successfully\n');
			} else {
				console.error(`❌ Page generation failed with code ${code}\n`);
			}
		});

		child.on('error', (err) => {
			isGenerating = false;
			console.error('❌ Failed to execute generate-pages.js:', err);
		});
	}

	return {
		name: 'vite-plugin-generate-pages',

		// Run once when Vite server starts
		buildStart() {
			console.log('🚀 Initial page generation...');
			generatePages();
		},

		// Watch for changes to pages.json
		configureServer(server) {
			const pagesJsonPath = path.resolve(__dirname, '../src/data/pages.json');

			// Watch the pages.json file
			server.watcher.add(pagesJsonPath);

			server.watcher.on('change', (file) => {
				// Only regenerate if pages.json changed
				if (file.endsWith('pages.json')) {
					generatePages();
				}
			});
		}
	};
}
