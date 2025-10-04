<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';

	let pat = $state('');
	let error = $state('');
	let loading = $state(false);

	onMount(() => {
		const storedPat = localStorage.getItem('github_pat');
		if (storedPat) {
			goto('/admin');
		}
	});

	async function handleLogin() {
		if (!pat.trim()) {
			error = 'Bitte geben Sie einen GitHub Personal Access Token ein';
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await fetch('https://api.github.com/repos/knuspermixx/NoCMS', {
				headers: {
					Authorization: `Bearer ${pat}`,
					Accept: 'application/vnd.github.v3+json'
				}
			});

			if (!response.ok) {
				throw new Error('Ungültiger Token oder keine Berechtigung');
			}

			localStorage.setItem('github_pat', pat);
			goto('/admin');
		} catch (err) {
			error = 'Authentifizierung fehlgeschlagen. Bitte überprüfen Sie Ihren Token und Repository-Zugriff.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-muted/40">
	<Card class="w-full max-w-md">
		<CardHeader>
			<CardTitle>Admin Login</CardTitle>
			<CardDescription>
				Geben Sie Ihren GitHub Personal Access Token ein
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form onsubmit={(e) => { e.preventDefault(); handleLogin(); }} class="space-y-4">
				<div class="space-y-2">
					<Label for="pat">GitHub Personal Access Token</Label>
					<Input
						id="pat"
						type="password"
						bind:value={pat}
						placeholder="ghp_xxxxxxxxxxxxx"
						disabled={loading}
					/>
				</div>

				{#if error}
					<div class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
						{error}
					</div>
				{/if}

				<Button type="submit" class="w-full" disabled={loading}>
					{loading ? 'Wird geprüft...' : 'Anmelden'}
				</Button>
			</form>
		</CardContent>
	</Card>
</div>
