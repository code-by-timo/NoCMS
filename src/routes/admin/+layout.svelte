<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';

	let { children } = $props();

	let isAuthenticated = $state(false);

	// Available pages for navigation
	const pages = [
		{ path: '/', label: 'Home' },
		{ path: '/ueber-mich', label: 'Über Mich' },
		{ path: '/kontakt', label: 'Kontakt' }
	];

	onMount(() => {
		const storedPat = localStorage.getItem('github_pat');
		if (!storedPat) {
			goto('/admin/login');
		} else {
			isAuthenticated = true;
		}
	});

	function handleLogout() {
		localStorage.removeItem('github_pat');
		goto('/admin/login');
	}

	function navigateToPage(path) {
		goto(`/admin/preview${path}`);
	}

	function isActivePage(path) {
		return $page.url.pathname === `/admin/preview${path}`;
	}
</script>

{#if isAuthenticated}
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
								onclick={() => navigateToPage(pageItem.path)}
								class="w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent {isActivePage(pageItem.path) ? 'bg-accent font-medium' : ''}"
							>
								{pageItem.label}
							</button>
						{/each}
					</nav>
				</div>
			</aside>

			<!-- Content Container -->
			<main class="relative flex-1 overflow-auto" style="container-type: size;">
				{@render children()}
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
