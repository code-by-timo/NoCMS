import { json } from '@sveltejs/kit';
import { writeFileSync } from 'fs';
import { join } from 'path';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const pages = await request.json();

		// Path to pages.json
		const pagesJsonPath = join(process.cwd(), 'src/data/pages.json');

		// Write to file
		writeFileSync(pagesJsonPath, JSON.stringify(pages, null, '\t'), 'utf-8');

		return json({ success: true });
	} catch (error) {
		console.error('Failed to update local pages.json:', error);
		return json({ success: false, error: String(error) }, { status: 500 });
	}
};
