/**
 * GitHub API utility for client-side Git operations
 * Uses GitHub REST API to commit and push changes directly from the browser
 */

export interface GitHubConfig {
	owner: string;
	repo: string;
	branch: string;
}

export class GitHubAPI {
	private pat: string;
	private config: GitHubConfig;
	private baseUrl = 'https://api.github.com';

	constructor(pat: string, config: GitHubConfig) {
		this.pat = pat;
		this.config = config;
	}

	private async fetchAPI(endpoint: string, options: RequestInit = {}) {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			...options,
			headers: {
				Authorization: `Bearer ${this.pat}`,
				Accept: 'application/vnd.github.v3+json',
				'Content-Type': 'application/json',
				...options.headers
			}
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`GitHub API error: ${response.status} ${error}`);
		}

		return response.json();
	}

	/**
	 * Validate the PAT by making a request to the repository
	 */
	async validatePAT(): Promise<boolean> {
		try {
			await this.fetchAPI(`/repos/${this.config.owner}/${this.config.repo}`);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Get the current commit SHA for a branch
	 */
	private async getBranchSHA(): Promise<string> {
		const data = await this.fetchAPI(
			`/repos/${this.config.owner}/${this.config.repo}/git/ref/heads/${this.config.branch}`
		);
		return data.object.sha;
	}

	/**
	 * Get the tree SHA from a commit
	 */
	private async getTreeSHA(commitSHA: string): Promise<string> {
		const data = await this.fetchAPI(
			`/repos/${this.config.owner}/${this.config.repo}/git/commits/${commitSHA}`
		);
		return data.tree.sha;
	}

	/**
	 * Get file content and SHA from repository
	 */
	private async getFileContent(path: string): Promise<{ content: string; sha: string } | null> {
		try {
			const data = await this.fetchAPI(
				`/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${this.config.branch}`
			);
			return {
				content: atob(data.content.replace(/\n/g, '')),
				sha: data.sha
			};
		} catch {
			return null;
		}
	}

	/**
	 * Create a blob (file content)
	 */
	private async createBlob(content: string): Promise<string> {
		const data = await this.fetchAPI(
			`/repos/${this.config.owner}/${this.config.repo}/git/blobs`,
			{
				method: 'POST',
				body: JSON.stringify({
					content: btoa(content),
					encoding: 'base64'
				})
			}
		);
		return data.sha;
	}

	/**
	 * Create a tree
	 */
	private async createTree(
		baseTreeSHA: string,
		files: Array<{ path: string; sha: string; mode: string; type: string }>
	): Promise<string> {
		const data = await this.fetchAPI(
			`/repos/${this.config.owner}/${this.config.repo}/git/trees`,
			{
				method: 'POST',
				body: JSON.stringify({
					base_tree: baseTreeSHA,
					tree: files
				})
			}
		);
		return data.sha;
	}

	/**
	 * Create a commit
	 */
	private async createCommit(
		message: string,
		treeSHA: string,
		parentSHA: string
	): Promise<string> {
		const data = await this.fetchAPI(
			`/repos/${this.config.owner}/${this.config.repo}/git/commits`,
			{
				method: 'POST',
				body: JSON.stringify({
					message,
					tree: treeSHA,
					parents: [parentSHA]
				})
			}
		);
		return data.sha;
	}

	/**
	 * Update a reference (branch)
	 */
	private async updateRef(commitSHA: string): Promise<void> {
		await this.fetchAPI(
			`/repos/${this.config.owner}/${this.config.repo}/git/refs/heads/${this.config.branch}`,
			{
				method: 'PATCH',
				body: JSON.stringify({
					sha: commitSHA,
					force: false
				})
			}
		);
	}

	/**
	 * Commit and push changes to GitHub
	 * @param filePath - Path to the file in the repository (e.g., 'src/data/pages.json')
	 * @param content - New file content
	 * @param message - Commit message
	 */
	async commitAndPush(filePath: string, content: string, message: string): Promise<void> {
		try {
			// 1. Get the current branch SHA
			const branchSHA = await this.getBranchSHA();

			// 2. Get the tree SHA from the commit
			const baseTreeSHA = await this.getTreeSHA(branchSHA);

			// 3. Create a blob with the new content
			const blobSHA = await this.createBlob(content);

			// 4. Create a new tree with the updated file
			const newTreeSHA = await this.createTree(baseTreeSHA, [
				{
					path: filePath,
					sha: blobSHA,
					mode: '100644',
					type: 'blob'
				}
			]);

			// 5. Create a new commit
			const newCommitSHA = await this.createCommit(message, newTreeSHA, branchSHA);

			// 6. Update the branch reference
			await this.updateRef(newCommitSHA);
		} catch (error) {
			console.error('GitHub API commit error:', error);
			throw new Error(
				`Failed to commit changes: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
		}
	}
}
