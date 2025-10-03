<script>
	import Navbar from '$lib/components/blocks/navbar/navbar1.svelte';

	let { children } = $props();
</script>

<Navbar />
<main>
	{@render children?.()}
</main>
