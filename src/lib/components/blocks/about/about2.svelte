<script>
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
</script>

<section class="py-24 bg-muted/30">
	<div class="container mx-auto px-4">
		<!-- Header -->
		<div class="text-center max-w-3xl mx-auto space-y-6 mb-16">
			<Badge variant="secondary" class="w-fit">Unser Ansatz</Badge>
			<h2 class="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
				Innovation trifft auf Erfahrung
			</h2>
			<p class="text-lg text-muted-foreground leading-relaxed">
				Wir kombinieren neueste Technologien mit bewährten Methoden, um außergewöhnliche digitale
				Erlebnisse zu schaffen, die messbare Ergebnisse liefern.
			</p>
			<Separator class="w-20 mx-auto" />
		</div>

		<!-- Features Grid -->
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
			<Card class="text-center group hover:shadow-lg transition-shadow duration-300">
				<CardHeader class="pb-4">
					<div class="w-16 h-16 bg-primary/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
						<div class="w-8 h-8 bg-primary rounded-lg" />
					</div>
					<CardTitle class="text-xl">Strategische Beratung</CardTitle>
				</CardHeader>
				<CardContent class="pt-0">
					<p class="text-muted-foreground">
						Wir analysieren Ihre Geschäftsziele und entwickeln maßgeschneiderte digitale Strategien.
					</p>
				</CardContent>
			</Card>

			<Card class="text-center group hover:shadow-lg transition-shadow duration-300">
				<CardHeader class="pb-4">
					<div class="w-16 h-16 bg-secondary/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
						<div class="w-8 h-8 bg-secondary rounded-lg" />
					</div>
					<CardTitle class="text-xl">Agile Entwicklung</CardTitle>
				</CardHeader>
				<CardContent class="pt-0">
					<p class="text-muted-foreground">
						Schnelle Iterationen und kontinuierliches Feedback für optimale Ergebnisse.
					</p>
				</CardContent>
			</Card>

			<Card class="text-center group hover:shadow-lg transition-shadow duration-300 md:col-span-2 lg:col-span-1">
				<CardHeader class="pb-4">
					<div class="w-16 h-16 bg-accent/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
						<div class="w-8 h-8 bg-accent rounded-lg" />
					</div>
					<CardTitle class="text-xl">Langfristige Partnerschaft</CardTitle>
				</CardHeader>
				<CardContent class="pt-0">
					<p class="text-muted-foreground">
						Wir begleiten Sie auch nach dem Launch mit Support und Weiterentwicklung.
					</p>
				</CardContent>
			</Card>
		</div>

		<!-- Stats Section -->
		<div class="bg-card rounded-2xl p-8 shadow-lg">
			<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
				<div class="text-center space-y-2">
					<div class="text-3xl font-bold text-primary">10+</div>
					<div class="text-sm text-muted-foreground uppercase tracking-wide">Jahre Erfahrung</div>
				</div>
				<div class="text-center space-y-2">
					<div class="text-3xl font-bold text-primary">98%</div>
					<div class="text-sm text-muted-foreground uppercase tracking-wide">Kundenzufriedenheit</div>
				</div>
				<div class="text-center space-y-2">
					<div class="text-3xl font-bold text-primary">24/7</div>
					<div class="text-sm text-muted-foreground uppercase tracking-wide">Support</div>
				</div>
				<div class="text-center space-y-2">
					<div class="text-3xl font-bold text-primary"></div>
					<div class="text-sm text-muted-foreground uppercase tracking-wide">Möglichkeiten</div>
				</div>
			</div>
		</div>
	</div>
</section>