<script>
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';

	// Import page components
	import HomePage from '../(pages)/+page.svelte';
	import UeberMichPage from '../(pages)/ueber-mich/+page.svelte';
	import KontaktPage from '../(pages)/kontakt/+page.svelte';

	let isAuthenticated = $state(false);
	let pat = $state('');
	let error = $state('');
	let loading = $state(false);
	let selectedPath = $state('/');

	// Canvas state
	let zoom = $state(1);
	let pan = $state({ x: 0, y: 0 });
	let isDragging = $state(false);
	let dragStart = $state({ x: 0, y: 0 });
	let canvasElement = $state(null);

	// Page configuration
	const pages = [
		{ path: '/', label: 'Home', component: HomePage },
		{ path: '/ueber-mich', label: 'Über Mich', component: UeberMichPage },
		{ path: '/kontakt', label: 'Kontakt', component: KontaktPage }
	];

	// Get current page component
	let CurrentPageComponent = $derived(
		pages.find(p => p.path === selectedPath)?.component || HomePage
	);

	onMount(() => {
		const storedPat = localStorage.getItem('github_pat');
		if (storedPat) {
			isAuthenticated = true;
			pat = storedPat;
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
			isAuthenticated = true;
		} catch {
			error = 'Authentifizierung fehlgeschlagen. Bitte überprüfen Sie Ihren Token und Repository-Zugriff.';
		} finally {
			loading = false;
		}
	}

	function handleLogout() {
		localStorage.removeItem('github_pat');
		isAuthenticated = false;
		pat = '';
		selectedPath = '/';
	}

	// Canvas Pan functionality
	function handleMouseDown(e) {
		isDragging = true;
		dragStart = { x: e.clientX - pan.x, y: e.clientY - pan.y };
	}

	function handleMouseMove(e) {
		if (!isDragging) return;
		pan = {
			x: e.clientX - dragStart.x,
			y: e.clientY - dragStart.y
		};
	}

	function handleMouseUp() {
		isDragging = false;
	}

	// Canvas Scroll functionality
	function handleWheel(e) {
		// Zoom with Ctrl/Cmd + Scroll
		if (e.ctrlKey || e.metaKey) {
			e.preventDefault();
			const delta = e.deltaY > 0 ? 0.9 : 1.1;
			const newZoom = Math.min(Math.max(zoom * delta, 0.5), 2);
			zoom = newZoom;
		} else {
			// Normal scroll behavior
			pan = {
				x: pan.x,
				y: pan.y - e.deltaY
			};
		}
	}

	// Reset canvas to center
	function resetCanvas() {
		zoom = 1;
		pan = { x: 0, y: 0 };
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
		<header class="flex h-14 items-center justify-between border-b bg-card px-6">
			<h1 class="text-lg font-semibold">Admin Panel</h1>
			<Button variant="outline" size="sm" onclick={handleLogout}>
				Abmelden
			</Button>
		</header>

		<!-- Main Content Area -->
		<div class="flex flex-1 overflow-hidden">
			<!-- Left Sidebar -->
			<aside class="w-64 border-r bg-card">
				<div class="flex h-full flex-col p-4">
					<nav class="space-y-1">
						<div class="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
							Seiten
						</div>
						{#each pages as pageItem}
							<button
								onclick={() => selectedPath = pageItem.path}
								class="w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent {selectedPath === pageItem.path ? 'bg-accent font-medium' : ''}"
							>
								{pageItem.label}
							</button>
						{/each}
					</nav>
				</div>
			</aside>

			<!-- Canvas Container -->
			<main
				bind:this={canvasElement}
				class="relative flex-1 overflow-hidden bg-muted"
				onmousedown={handleMouseDown}
				onmousemove={handleMouseMove}
				onmouseup={handleMouseUp}
				onmouseleave={handleMouseUp}
				onwheel={handleWheel}
				style="cursor: {isDragging ? 'grabbing' : 'grab'};"
			>
				<!-- Zoom Controls -->
				<div class="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-md bg-card/90 px-3 py-2 text-sm shadow-lg backdrop-blur-sm">
					<span class="text-muted-foreground">{Math.round(zoom * 100)}%</span>
					<div class="h-4 w-px bg-border"></div>
					<button
						onclick={resetCanvas}
						class="rounded px-2 py-1 text-xs transition-colors hover:bg-accent"
						title="Reset view"
					>
						Reset
					</button>
				</div>

				<!-- Canvas Content -->
				<div
					class="absolute inset-0 flex items-center justify-center"
					style="transform: translate({pan.x}px, {pan.y}px);"
				>
					<!-- Page Container -->
					<div
						class="bg-background shadow-2xl"
						style="transform: scale({zoom}); transform-origin: center; transition: transform 0.1s ease-out; max-width: 1200px; width: 100%;"
					>
						<CurrentPageComponent />
					</div>
				</div>
			</main>

			<!-- Right Sidebar -->
			<aside class="w-64 border-l bg-card">
				<div class="p-4">
					<div class="text-sm text-muted-foreground">
						<!-- Tools/widgets can be added here -->
					</div>
				</div>
			</aside>
		</div>
	</div>
{/if}
