<script>
	// Dynamic section renderer - renders the correct block component based on section type
	import Hero1 from '$lib/components/blocks/hero/hero1.svelte';
	import Hero2 from '$lib/components/blocks/hero/hero2.svelte';
	import About1 from '$lib/components/blocks/about/about1.svelte';
	import About2 from '$lib/components/blocks/about/about2.svelte';
	import Contact1 from '$lib/components/blocks/contact/contact1.svelte';

	let { section, onDelete = null, onClick = null, isSelected = false } = $props();

	// Section type to component mapping
	const componentMap = {
		hero1: Hero1,
		hero2: Hero2,
		about1: About1,
		about2: About2,
		contact1: Contact1
	};

	const Component = $derived(componentMap[section.type]);

	let isHovering = $state(false);
</script>

<div
	class="section-wrapper relative group cursor-pointer"
	class:selected={isSelected}
	onmouseenter={() => (isHovering = true)}
	onmouseleave={() => (isHovering = false)}
	onclick={onClick}
	role="button"
	tabindex="0"
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onClick?.();
		}
	}}
>
	<!-- Render the section component with its props -->
	{#if Component}
		<Component {...section.props} />
	{:else}
		<div class="py-24 text-center text-muted-foreground">
			Unknown section type: {section.type}
		</div>
	{/if}

	<!-- Delete button on hover (if onDelete is provided) -->
	{#if isHovering && onDelete}
		<button
			onclick={onDelete}
			class="absolute top-4 right-4 z-50 bg-destructive text-destructive-foreground rounded-full p-2 shadow-lg hover:bg-destructive/90 transition-colors opacity-0 group-hover:opacity-100"
			aria-label="Delete section"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M3 6h18" />
				<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
				<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
			</svg>
		</button>
	{/if}
</div>

<style>
	.section-wrapper {
		transition: outline 0.15s ease;
	}

	.section-wrapper:hover {
		outline: 2px dashed hsl(var(--primary) / 0.5);
		outline-offset: -2px;
	}

	.section-wrapper.selected {
		outline: 2px solid hsl(var(--primary));
		outline-offset: -2px;
	}

	.section-wrapper.selected:hover {
		outline: 2px solid hsl(var(--primary) / 0.8);
	}
</style>
