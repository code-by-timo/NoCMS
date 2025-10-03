<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Monitor, Tablet, Smartphone } from 'lucide-svelte';

	let isAuthenticated = $state(false);
	let pat = $state('');
	let error = $state('');
	let loading = $state(false);
	let iframeUrl = $state('/');

	type DeviceType = 'desktop' | 'tablet' | 'mobile';
	let currentDevice = $state<DeviceType>('desktop');

	const deviceSizes = {
		desktop: { width: '100%', height: '100%' },
		tablet: { width: '768px', height: '1024px' },
		mobile: { width: '375px', height: '667px' }
	};

	onMount(() => {
		// Check if user is authenticated
		const storedPat = localStorage.getItem('github_pat');
		if (storedPat) {
			isAuthenticated = true;
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
			// Verify PAT by checking access to the repository
			const response = await fetch('https://api.github.com/repos/knuspermixx/NoCMS', {
				headers: {
					Authorization: `Bearer ${pat}`,
					Accept: 'application/vnd.github.v3+json'
				}
			});

			if (!response.ok) {
				throw new Error('Ungültiger Token oder keine Berechtigung');
			}

			// Store PAT in localStorage
			localStorage.setItem('github_pat', pat);
			isAuthenticated = true;
		} catch (err) {
			error = 'Authentifizierung fehlgeschlagen. Bitte überprüfen Sie Ihren Token und Repository-Zugriff.';
		} finally {
			loading = false;
		}
	}

	function handleLogout() {
		localStorage.removeItem('github_pat');
		isAuthenticated = false;
		pat = '';
	}
</script>

{#if !isAuthenticated}
	<!-- Login View -->
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
{:else}
	<!-- Admin Panel View -->
	<div class="flex h-screen flex-col bg-background">
		<!-- Top Bar -->
		<header class="border-b bg-card">
			<div class="flex h-14 items-center justify-between px-6">
				<h1 class="text-lg font-semibold">Admin Panel</h1>

				<!-- Device Preview Toggle -->
				<div class="flex items-center gap-1 rounded-md border bg-muted/50 p-1">
					<Button
						variant="ghost"
						size="icon"
						class={currentDevice === 'desktop' ? 'bg-background shadow-sm' : ''}
						onclick={() => currentDevice = 'desktop'}
					>
						<Monitor class="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						class={currentDevice === 'tablet' ? 'bg-background shadow-sm' : ''}
						onclick={() => currentDevice = 'tablet'}
					>
						<Tablet class="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						class={currentDevice === 'mobile' ? 'bg-background shadow-sm' : ''}
						onclick={() => currentDevice = 'mobile'}
					>
						<Smartphone class="h-4 w-4" />
					</Button>
				</div>

				<Button variant="outline" size="sm" onclick={handleLogout}>
					Abmelden
				</Button>
			</div>
		</header>

		<!-- Main Content Area -->
		<div class="flex flex-1 overflow-hidden">
			<!-- Left Sidebar -->
			<aside class="w-64 border-r bg-card">
				<div class="flex h-full flex-col p-4">
					<nav class="space-y-2">
						<!-- Placeholder for future navigation items -->
					</nav>

					<div class="mt-auto pt-4">
						<Separator class="mb-4" />
						<Button variant="ghost" size="sm" class="w-full justify-start" onclick={handleLogout}>
							Abmelden
						</Button>
					</div>
				</div>
			</aside>

			<!-- Center Content -->
			<main class="flex-1 overflow-hidden bg-muted/20">
				<div class="flex h-full w-full items-center justify-center p-4">
					{#if browser}
						<div
							class="max-h-full max-w-full transition-all duration-300 ease-in-out {currentDevice !== 'desktop' ? 'rounded-lg border bg-background shadow-xl' : ''}"
							style="width: {deviceSizes[currentDevice].width}; height: {deviceSizes[currentDevice].height};"
						>
							<iframe
								src={iframeUrl}
								title="Website Preview"
								class="h-full w-full border-0 {currentDevice !== 'desktop' ? 'rounded-lg' : ''}"
							></iframe>
						</div>
					{/if}
				</div>
			</main>

			<!-- Right Sidebar -->
			<aside class="w-64 border-l bg-card">
				<div class="p-4">
					<!-- Placeholder for future tools/widgets -->
				</div>
			</aside>
		</div>
	</div>
{/if}
