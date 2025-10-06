<script>
	import Navbar from '$lib/components/blocks/navbar/navbar1.svelte';
	// `preview` indicates the wrapper is being used inside the admin device previews
	// It ensures the page is rendered inside a transformed/scrollable container so
	// any `position: fixed` elements (e.g. the site's Navbar) are contained inside
	// that device viewport without changing the Navbar itself.
	let { preview = false, children } = $props();
</script>

<div class={preview ? 'relative w-full h-full overflow-hidden' : 'w-full'}>
	<!-- Navbar manages its absolute/fixed behavior internally; wrapper just provides the viewport -->
	<Navbar />
	{#if preview}
		<div class="w-full" style="transform: translateZ(0); position:relative; overflow:visible;">
			<main class="w-full">
				{@render children?.()}
			</main>
		</div>
	{:else}
		<main>
			{@render children?.()}
		</main>
	{/if}
</div>
