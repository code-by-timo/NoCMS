<script>
	import { page } from '$app/stores';

	// Import all page components
	import HomePage from '../../../(pages)/+page.svelte';
	import UeberMichPage from '../../../(pages)/ueber-mich/+page.svelte';
	import KontaktPage from '../../../(pages)/kontakt/+page.svelte';

	// Map paths to components
	const pageComponents = {
		'/': HomePage,
		'/ueber-mich': UeberMichPage,
		'/kontakt': KontaktPage
	};

	// Get the current path from the URL
	let currentPath = $derived($page.params.path ? `/${$page.params.path}` : '/');

	// Get the component to render
	let PageComponent = $derived(pageComponents[currentPath] || HomePage);
</script>

<div class="min-h-full">
	<PageComponent />
</div>
