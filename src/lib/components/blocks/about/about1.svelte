<script>
	import { Card, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';

	let {
		badge = 'Über uns',
		title = 'Wir gestalten die digitale Zukunft',
		description = 'Mit über 10 Jahren Erfahrung entwickeln wir maßgeschneiderte Lösungen, die Ihr Unternehmen voranbringen und nachhaltigen Erfolg schaffen.',
		buttonText = 'Mehr erfahren',
		buttonLink = '#'
	} = $props();
</script>

<section class="py-24 bg-background">
	<div class="container mx-auto px-4">
		<div class="grid lg:grid-cols-2 gap-12 items-center">
			<!-- Content Side -->
			<div class="space-y-8">
				<div class="space-y-4">
					<Badge variant="secondary" class="w-fit">{badge}</Badge>
					<h2 class="text-4xl font-bold tracking-tight text-foreground">
						{title}
					</h2>
					<p class="text-xl text-muted-foreground leading-relaxed">
						{description}
					</p>
				</div>

				<div class="grid sm:grid-cols-2 gap-6">
					<Card class="border-l-4 border-l-primary">
						<CardHeader class="pb-3">
							<CardTitle class="text-lg">150+</CardTitle>
							<CardDescription>Erfolgreiche Projekte</CardDescription>
						</CardHeader>
					</Card>
					<Card class="border-l-4 border-l-primary">
						<CardHeader class="pb-3">
							<CardTitle class="text-lg">50+</CardTitle>
							<CardDescription>Zufriedene Kunden</CardDescription>
						</CardHeader>
					</Card>
				</div>

				<div class="space-y-4">
					<h3 class="text-xl font-semibold text-foreground">Unsere Expertise</h3>
					<div class="flex flex-wrap gap-2">
						<Badge variant="outline">Web Development</Badge>
						<Badge variant="outline">Mobile Apps</Badge>
						<Badge variant="outline">UI/UX Design</Badge>
						<Badge variant="outline">E-Commerce</Badge>
						<Badge variant="outline">Cloud Solutions</Badge>
					</div>
				</div>

				<Button href={buttonLink} size="lg" class="w-fit">
					{buttonText}
				</Button>
			</div>

			<!-- Image Side -->
			<div class="relative">
				<div class="relative overflow-hidden rounded-2xl shadow-2xl">
					<div class="aspect-[4/3] bg-gradient-to-br from-primary/20 to-primary/5">
						<div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=450&fit=crop')] bg-cover bg-center"></div>
						<div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
					</div>
				</div>
				<!-- Decorative Elements -->
				<div class="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
				<div class="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/20 rounded-full blur-xl"></div>
			</div>
		</div>
	</div>
</section>