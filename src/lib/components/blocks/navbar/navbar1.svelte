<script>
	import { Button } from '$lib/components/ui/button';
	import {
		Sheet,
		SheetContent,
		SheetDescription,
		SheetHeader,
		SheetTitle,
		SheetTrigger
	} from '$lib/components/ui/sheet';
	import { cn } from '$lib/utils.js';

	let isOpen = $state(false);
	let scrolled = $state(false);

	// Handle scroll effect
	if (typeof window !== 'undefined') {
		const handleScroll = () => {
			scrolled = window.scrollY > 20;
		};
		
		window.addEventListener('scroll', handleScroll);
	}

	const navItems = [
		{ title: 'Home', href: '/' },
		{ title: 'Über mich', href: '/ueber-mich' },
		{ title: 'Kontakt', href: '/contact' }
	];
</script>

<nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {scrolled ? 'bg-background/90 backdrop-blur-lg shadow-lg border-b border-border/50' : 'bg-transparent'}">
	<div class="container mx-auto px-4">
		<div class="flex items-center justify-between h-16 lg:h-20">
			<!-- Logo -->
			<a href="/" class="flex items-center space-x-3 group">
				<div class="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
					<div class="w-6 h-6 bg-white rounded-sm"></div>
				</div>
				<span class="text-xl font-bold text-foreground hidden sm:block">NoCMS</span>
			</a>

			<!-- Desktop Navigation -->
			<div class="hidden lg:flex items-center space-x-8">
				{#each navItems as item}
					<a href={item.href} class="text-foreground hover:text-primary transition-colors px-3 py-2 font-medium">
						{item.title}
					</a>
				{/each}
			</div>

			<!-- Desktop CTA -->
			<div class="hidden lg:flex">
				<Button href="/contact" class="shadow-lg hover:shadow-xl transition-all duration-300">
					Kontakt
				</Button>
			</div>

			<!-- Mobile Menu Trigger -->
			<div class="lg:hidden">
				<Sheet bind:open={isOpen}>
					<SheetTrigger>
						{#snippet child({ props })}
							<Button
								{...props}
								variant="ghost"
								size="icon"
								class={cn('p-2', props.class)}
							>
								<div class="space-y-1.5">
									<div class="w-5 h-0.5 bg-foreground rounded transition-all duration-300 {isOpen ? 'rotate-45 translate-y-2' : ''}"></div>
									<div class="w-5 h-0.5 bg-foreground rounded transition-all duration-300 {isOpen ? 'opacity-0' : ''}"></div>
									<div class="w-5 h-0.5 bg-foreground rounded transition-all duration-300 {isOpen ? '-rotate-45 -translate-y-2' : ''}"></div>
								</div>
							</Button>
						{/snippet}
					</SheetTrigger>
					<SheetContent side="right" class="w-80 sm:w-96">
						<SheetHeader class="text-left mb-8">
							<SheetTitle class="flex items-center space-x-3">
								<div class="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
									<div class="w-4 h-4 bg-white rounded-sm"></div>
								</div>
								<span class="text-xl font-bold">NoCMS</span>
							</SheetTitle>
						</SheetHeader>

						<div class="space-y-6">
							<!-- Navigation Links -->
							<nav class="space-y-2">
								{#each navItems as item}
									<a
										href={item.href}
										class="block px-4 py-3 text-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-colors font-medium"
										onclick={() => isOpen = false}
									>
										{item.title}
									</a>
								{/each}
							</nav>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	</div>
</nav>

<style>
	/* Smooth animations for mobile menu toggle */
	.space-y-1\.5 > div {
		transform-origin: center;
	}
</style>
