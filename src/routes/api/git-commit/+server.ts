import { json } from '@sveltejs/kit';
import simpleGit from 'simple-git';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { message, pat } = await request.json();

		if (!pat) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Validate the PAT
		const githubResponse = await fetch('https://api.github.com/repos/knuspermixx/NoCMS', {
			headers: {
				Authorization: `Bearer ${pat}`,
				Accept: 'application/vnd.github.v3+json'
			}
		});

		if (!githubResponse.ok) {
			return json({ error: 'Invalid PAT' }, { status: 401 });
		}

		// Initialize git
		const git = simpleGit(process.cwd());

		// Add changes
		await git.add('src/data/pages.json');

		// Commit
		await git.commit(message || 'Update pages from CMS');

		// Push (using PAT for authentication)
		// Note: You might need to configure the remote URL with the PAT
		try {
			await git.push();
		} catch (pushError) {
			console.warn('Push failed, but commit was successful:', pushError);
			// Don't fail the request if push fails - the commit is still saved locally
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error committing changes:', error);
		return json({ error: 'Failed to commit changes' }, { status: 500 });
	}
};
