<script>
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';

	let {
		badge = '🚀 Neue Website? Perfekt!',
		title = 'Digitale Lösungen, die',
		titleHighlight = 'begeistern',
		description = 'Wir entwickeln maßgeschneiderte Web- und Mobile-Anwendungen, die Ihr Unternehmen voranbringen und Ihre Kunden begeistern.',
		primaryButtonText = 'Projekt starten',
		primaryButtonLink = '#',
		secondaryButtonText = 'Portfolio ansehen',
		secondaryButtonLink = '#',
		stats = [
			{ value: '150+', label: 'Projekte' },
			{ value: '50+', label: 'Kunden' },
			{ value: '5★', label: 'Bewertung' },
			{ value: '24/7', label: 'Support' }
		]
	} = $props();
</script>

<section class="relative flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden"
    style="container-type: inline-size; min-height: var(--preview-100vh, 100svh);">
	<!-- Background Decorations -->
	<div class="absolute inset-0 overflow-hidden">
		<div class="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
		<div class="absolute bottom-1/4 left-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
		<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
	</div>

	<!-- Grid Pattern -->
	<div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>

	<div class="relative z-10 container mx-auto px-4 text-center">
		<div class="max-w-4xl mx-auto space-y-8">
			<!-- Badge -->
			<div class="animate-fade-in" style="animation-delay: 0.2s;">
				<Badge variant="secondary" class="text-sm px-4 py-2">
					{badge}
				</Badge>
			</div>

			<!-- Main Heading -->
			<div class="animate-fade-in" style="animation-delay: 0.4s;">
				<h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
					{title}
					<span class="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
						{titleHighlight}
					</span>
				</h1>
			</div>

			<!-- Description -->
			<div class="animate-fade-in" style="animation-delay: 0.6s;">
				<p class="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
					{description}
				</p>
			</div>

			<!-- CTA Buttons -->
			<div class="animate-fade-in flex flex-col sm:flex-row gap-4 justify-center items-center pt-4" style="animation-delay: 0.8s;">
				<Button href={primaryButtonLink} size="lg" class="text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all duration-300">
					{primaryButtonText}
				</Button>
				<Button href={secondaryButtonLink} variant="outline" size="lg" class="text-lg px-8 py-6 h-auto border-2 hover:bg-muted/50 transition-all duration-300">
					{secondaryButtonText}
				</Button>
			</div>

			<!-- Stats -->
			<div class="animate-fade-in pt-16" style="animation-delay: 1s;">
				<div class="flex flex-wrap justify-center gap-8 text-center">
					{#each stats as stat}
						<div class="space-y-1">
							<div class="text-3xl font-bold text-foreground">{stat.value}</div>
							<div class="text-sm text-muted-foreground">{stat.label}</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Scroll Indicator -->
	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
		<div class="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center">
			<div class="w-1 h-3 bg-muted-foreground rounded-full mt-2"></div>
		</div>
	</div>
</section>

<style>
	/* Container queries so the hero respects the width of its container (useful for admin previews) */
	:global(section) {
		container-type: inline-size;
	}

	/* Small / mobile container */
	@container (max-width: 639px) {
		h1 {
			font-size: 2rem; /* mobile size */
		}
		p {
			font-size: 1rem;
		}
	}

	/* Medium / tablet container */
	@container (min-width: 640px) and (max-width: 1023px) {
		h1 {
			font-size: 3.75rem; /* Tailwind 6xl equivalent */
		}
		p {
			font-size: 1.125rem;
		}
	}

	/* Large / desktop container */
	@container (min-width: 1024px) {
		h1 {
			font-size: 4.5rem; /* Tailwind 7xl equivalent */
		}
		p {
			font-size: 1.25rem;
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-fade-in {
		animation: fade-in 0.6s ease-out forwards;
		opacity: 0;
	}
</style>