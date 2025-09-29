<script>
	import '../app.css';
	import logo from '$lib/assets/logo.svg';
	import Navbar from '$lib/components//blocks/navbar/navbar1.svelte';
	import { isAuthenticated, authReady } from '$lib/stores/auth.js';
	import { page } from '$app/state';
	import AdminLayout from './admin-layout.svelte';

	const { children } = $props();
	
	let isAuth = $state(false);
	let ready = $state(false);
	const currentPath = $derived(page.url.pathname);

	$effect(() => {
		const unsubAuth = isAuthenticated.subscribe(value => {
			isAuth = value;
		});
		
		const unsubReady = authReady.subscribe(value => {
			ready = value;
		});
		
		return () => {
			unsubAuth();
			unsubReady();
		};
	});

	// Don't use admin layout for login/logout pages
	const isAuthPage = $derived(currentPath === '/login' || currentPath === '/logout');
	const shouldUseAdminLayout = $derived(ready && isAuth && !isAuthPage);
</script>

<svelte:head>
	<link rel="icon" href={logo} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

{#if shouldUseAdminLayout}
	<AdminLayout>
		{@render children?.()}
	</AdminLayout>
{:else}
	<Navbar />
	<main>
		{@render children?.()}
	</main>
{/if}
