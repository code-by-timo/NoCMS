<script>
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
</script>

<section class="relative min-h-screen overflow-hidden">
	<!-- Background Image with Overlay -->
	<div class="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center"></div>
	<div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
	<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

	<!-- Floating Elements -->
	<div class="absolute top-20 right-20 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float"></div>
	<div class="absolute bottom-32 left-16 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-float" style="animation-delay: -2s;"></div>
	<div class="absolute top-1/2 right-1/3 w-16 h-16 bg-accent/20 rounded-full blur-lg animate-float" style="animation-delay: -4s;"></div>

	<div class="relative z-10 min-h-screen flex items-center">
		<div class="container mx-auto px-4">
			<div class="grid lg:grid-cols-2 gap-12 items-center">
				<!-- Content Side -->
				<div class="space-y-8 text-white">
					<div class="space-y-6 animate-slide-in">
						<Badge variant="secondary" class="bg-white/10 text-white border-white/20 hover:bg-white/20">
							Willkommen bei der Zukunft
						</Badge>
						
						<h1 class="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
							Revolutionäre
							<span class="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
								Technologie
							</span>
							für Ihr Business
						</h1>
						
						<p class="text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-2xl">
							Transformieren Sie Ihre Geschäftsprozesse mit unseren innovativen Lösungen und
							erreichen Sie neue Dimensionen des Erfolgs.
						</p>
					</div>

					<div class="flex flex-col sm:flex-row gap-4 animate-slide-in" style="animation-delay: 0.3s;">
						<Button size="lg" class="bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/25 text-lg px-8 py-6 h-auto">
							Kostenlose Demo
						</Button>
						<Button 
							variant="outline" 
							size="lg" 
							class="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-lg px-8 py-6 h-auto backdrop-blur-sm"
						>
							Mehr erfahren
						</Button>
					</div>

					<!-- Key Features -->
					<div class="grid sm:grid-cols-3 gap-4 pt-8 animate-slide-in" style="animation-delay: 0.6s;">
						<div class="flex items-center space-x-3">
							<div class="w-2 h-2 bg-primary rounded-full"></div>
							<span class="text-white/90 font-medium">KI-gestützt</span>
						</div>
						<div class="flex items-center space-x-3">
							<div class="w-2 h-2 bg-secondary rounded-full"></div>
							<span class="text-white/90 font-medium">Cloud-nativ</span>
						</div>
						<div class="flex items-center space-x-3">
							<div class="w-2 h-2 bg-accent rounded-full"></div>
							<span class="text-white/90 font-medium">Skalierbar</span>
						</div>
					</div>
				</div>

				<!-- Interactive Cards -->
				<div class="space-y-6 animate-fade-in-up" style="animation-delay: 0.9s;">
					<Card class="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 group">
						<CardContent class="p-6">
							<div class="flex items-start space-x-4">
								<div class="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
									<div class="w-6 h-6 bg-white rounded-sm"></div>
								</div>
								<div class="space-y-2">
									<h3 class="text-xl font-semibold text-white">Automatisierung</h3>
									<p class="text-gray-300">Reduzieren Sie manuelle Arbeiten um bis zu 80%</p>
									<div class="text-primary font-medium">→ Mehr Details</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card class="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 group">
						<CardContent class="p-6">
							<div class="flex items-start space-x-4">
								<div class="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/70 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
									<div class="w-6 h-6 bg-white rounded-sm"></div>
								</div>
								<div class="space-y-2">
									<h3 class="text-xl font-semibold text-white">Analytik</h3>
									<p class="text-gray-300">Datenbasierte Entscheidungen in Echtzeit</p>
									<div class="text-secondary font-medium">→ Mehr Details</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card class="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 group">
						<CardContent class="p-6">
							<div class="flex items-start space-x-4">
								<div class="w-12 h-12 bg-gradient-to-br from-accent to-accent/70 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
									<div class="w-6 h-6 bg-white rounded-sm"></div>
								</div>
								<div class="space-y-2">
									<h3 class="text-xl font-semibold text-white">Integration</h3>
									<p class="text-gray-300">Nahtlose Verbindung zu bestehenden Systemen</p>
									<div class="text-accent font-medium">→ Mehr Details</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	</div>

	<!-- Bottom Wave -->
	<div class="absolute bottom-0 left-0 right-0">
		<svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="w-full h-20 fill-background">
			<path d="M1200 120L0 16.48 0 120 1200 120z"></path>
		</svg>
	</div>
</section>

<style>
	@keyframes float {
		0%, 100% { transform: translateY(0px); }
		50% { transform: translateY(-20px); }
	}
	
	@keyframes slide-in {
		from {
			opacity: 0;
			transform: translateX(-30px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
	
	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.animate-float {
		animation: float 6s ease-in-out infinite;
	}
	
	.animate-slide-in {
		animation: slide-in 0.8s ease-out forwards;
		opacity: 0;
	}
	
	.animate-fade-in-up {
		animation: fade-in-up 0.8s ease-out forwards;
		opacity: 0;
	}
</style>