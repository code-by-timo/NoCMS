<script>
	import '../app.css';
	import RootWrapper from '$lib/components/RootWrapper.svelte';
	import { page } from '$app/stores';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

{#if $page.url.pathname.startsWith('/admin')}
	{@render children?.()}
{:else}
	<RootWrapper>
		{@render children?.()}
	</RootWrapper>
{/if}
