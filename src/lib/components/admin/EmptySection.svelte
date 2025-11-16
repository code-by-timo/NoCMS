<script>
	import { Button } from '$lib/components/ui/button';

	let { onAddSection } = $props();

	let isHovering = $state(false);
</script>

<div
	class="empty-section relative min-h-[200px] flex items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-lg transition-all duration-200"
	class:hovered={isHovering}
	onmouseenter={() => (isHovering = true)}
	onmouseleave={() => (isHovering = false)}
>
	<div class="text-center space-y-4">
		<p class="text-muted-foreground text-sm">Leere Section</p>

		{#if isHovering}
			<div class="animate-fade-in">
				<Button onclick={onAddSection} variant="default" class="gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M5 12h14" />
						<path d="M12 5v14" />
					</svg>
					Section
				</Button>
			</div>
		{/if}
	</div>
</div>

<style>
	.empty-section.hovered {
		border-color: hsl(var(--primary) / 0.5);
		background-color: hsl(var(--primary) / 0.05);
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.2s ease-out;
	}
</style>
