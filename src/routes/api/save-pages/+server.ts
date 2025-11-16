import { json } from '@sveltejs/kit';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { pages, pat } = await request.json();

		if (!pat) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Validate the PAT by making a GitHub API request
		const githubResponse = await fetch('https://api.github.com/repos/knuspermixx/NoCMS', {
			headers: {
				Authorization: `Bearer ${pat}`,
				Accept: 'application/vnd.github.v3+json'
			}
		});

		if (!githubResponse.ok) {
			return json({ error: 'Invalid PAT' }, { status: 401 });
		}

		// Write pages to data file
		const dataPath = join(process.cwd(), 'src', 'data', 'pages.json');
		await writeFile(dataPath, JSON.stringify(pages, null, 2));

		return json({ success: true });
	} catch (error) {
		console.error('Error saving pages:', error);
		return json({ error: 'Failed to save pages' }, { status: 500 });
	}
};
