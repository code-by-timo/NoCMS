#!/usr/bin/env node

/**
 * Generate static page files from pages.json
 * This script runs before each build to create .svelte files for all pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAGES_JSON_PATH = path.join(__dirname, '../src/data/pages.json');
const PAGES_DIR = path.join(__dirname, '../src/routes/(public)');

// Read pages.json
let pages = [];
try {
	const pagesContent = fs.readFileSync(PAGES_JSON_PATH, 'utf-8');
	pages = JSON.parse(pagesContent);
	console.log(`✓ Loaded ${pages.length} pages from pages.json`);
} catch (error) {
	console.error('✗ Could not read pages.json:', error.message);
	process.exit(1);
}

// Clean existing page files (except admin)
function cleanPagesDir(dir) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
		return;
	}

	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		// Skip admin directory
		if (entry.name === 'admin') continue;

		if (entry.isDirectory()) {
			fs.rmSync(fullPath, { recursive: true, force: true });
		} else if (entry.isFile() && entry.name.endsWith('.svelte')) {
			fs.unlinkSync(fullPath);
		}
	}
}

// Generate Svelte component for a page
function generatePageComponent(page) {
	const sections = page.sections || [];

	// Generate import statements for each component
	const componentTypes = [...new Set(sections.map(s => s.type))];
	const imports = componentTypes.map(type => {
		const componentName = type.charAt(0).toUpperCase() + type.slice(1);
		const folder = type.replace(/[0-9]/g, ''); // Remove numbers (hero1 -> hero)
		return `\timport ${componentName} from '$lib/components/blocks/${folder}/${type}.svelte';`;
	}).join('\n');

	// Generate component mapping
	const componentMap = componentTypes.map(type => {
		const componentName = type.charAt(0).toUpperCase() + type.slice(1);
		return `\t\t${type}: ${componentName}`;
	}).join(',\n');

	// Generate section renders
	const sectionRenders = sections.map((section, index) => {
		const componentName = section.type.charAt(0).toUpperCase() + section.type.slice(1);
		const propsJson = JSON.stringify(section.props || {});
		return `\t<${componentName} {...(${propsJson})} />`;
	}).join('\n');

	return `<script>
${imports}
</script>

${sectionRenders}
`;
}

// Generate pages
console.log('Cleaning old page files...');
cleanPagesDir(PAGES_DIR);

let generatedCount = 0;

for (const page of pages) {
	const { path: pagePath, label } = page;

	// Determine file path
	let filePath;
	if (pagePath === '/') {
		// Root page
		filePath = path.join(PAGES_DIR, '+page.svelte');
	} else {
		// Nested page
		const cleanPath = pagePath.replace(/^\//, '').replace(/\/$/, '');
		const pageDir = path.join(PAGES_DIR, cleanPath);
		fs.mkdirSync(pageDir, { recursive: true });
		filePath = path.join(pageDir, '+page.svelte');
	}

	// Generate component
	const component = generatePageComponent(page);
	fs.writeFileSync(filePath, component, 'utf-8');

	console.log(`✓ Generated: ${filePath.replace(PAGES_DIR, '(public)')}`);
	generatedCount++;
}

console.log(`\n✓ Successfully generated ${generatedCount} page files`);
