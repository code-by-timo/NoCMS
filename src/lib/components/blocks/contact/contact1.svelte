<script>
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';

	let formData = $state({
		name: '',
		email: '',
		company: '',
		message: ''
	});

	let isSubmitting = $state(false);

	async function handleSubmit(event) {
		event.preventDefault();
		isSubmitting = true;
		
		// Simulate form submission
		await new Promise(resolve => setTimeout(resolve, 1000));
		
		// Reset form
		formData = { name: '', email: '', company: '', message: '' };
		isSubmitting = false;
	}
</script>

<section class="py-24 bg-background">
	<div class="container mx-auto px-4">
		<div class="grid lg:grid-cols-2 gap-16 items-start">
			<!-- Contact Info -->
			<div class="space-y-8">
				<div class="space-y-4">
					<Badge variant="secondary" class="w-fit">Kontakt</Badge>
					<h2 class="text-4xl font-bold tracking-tight text-foreground">
						Lassen Sie uns über Ihr Projekt sprechen
					</h2>
					<p class="text-lg text-muted-foreground leading-relaxed">
						Haben Sie eine Idee oder ein Projekt im Kopf? Wir freuen uns darauf, von Ihnen zu hören
						und gemeinsam die perfekte Lösung zu entwickeln.
					</p>
				</div>

				<Separator class="w-20" />

				<div class="space-y-6">
					<div class="flex items-center space-x-4">
						<div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
							<div class="w-6 h-6 bg-primary rounded-sm"></div>
						</div>
						<div>
							<h3 class="font-semibold text-foreground">E-Mail</h3>
							<p class="text-muted-foreground">hello@example.com</p>
						</div>
					</div>

					<div class="flex items-center space-x-4">
						<div class="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
							<div class="w-6 h-6 bg-secondary rounded-sm"></div>
						</div>
						<div>
							<h3 class="font-semibold text-foreground">Telefon</h3>
							<p class="text-muted-foreground">+49 123 456 789</p>
						</div>
					</div>

					<div class="flex items-center space-x-4">
						<div class="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
							<div class="w-6 h-6 bg-accent rounded-sm"></div>
						</div>
						<div>
							<h3 class="font-semibold text-foreground">Antwortzeit</h3>
							<p class="text-muted-foreground">Innerhalb von 24 Stunden</p>
						</div>
					</div>
				</div>

				<div class="p-6 bg-muted/50 rounded-xl">
					<h4 class="font-semibold text-foreground mb-3">Kostenlose Erstberatung</h4>
					<p class="text-sm text-muted-foreground">
						Wir bieten Ihnen eine unverbindliche 30-minütige Beratung, um Ihr Projekt zu besprechen
						und erste Lösungsansätze zu entwickeln.
					</p>
				</div>
			</div>

			<!-- Contact Form -->
			<Card class="shadow-xl">
				<CardHeader>
					<CardTitle class="text-2xl">Nachricht senden</CardTitle>
					<CardDescription>
						Füllen Sie das Formular aus und wir melden uns schnellstmöglich bei Ihnen.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onsubmit={handleSubmit} class="space-y-6">
						<div class="grid sm:grid-cols-2 gap-4">
							<div class="space-y-2">
								<Label for="name">Name *</Label>
								<Input
									id="name"
									bind:value={formData.name}
									placeholder="Ihr vollständiger Name"
									required
									class="transition-colors focus:ring-2 focus:ring-primary/20"
								/>
							</div>
							<div class="space-y-2">
								<Label for="email">E-Mail *</Label>
								<Input
									id="email"
									type="email"
									bind:value={formData.email}
									placeholder="ihre.email@example.com"
									required
									class="transition-colors focus:ring-2 focus:ring-primary/20"
								/>
							</div>
						</div>

						<div class="space-y-2">
							<Label for="company">Unternehmen</Label>
							<Input
								id="company"
								bind:value={formData.company}
								placeholder="Ihr Unternehmen (optional)"
								class="transition-colors focus:ring-2 focus:ring-primary/20"
							/>
						</div>

						<div class="space-y-2">
							<Label for="message">Nachricht *</Label>
							<Textarea
								id="message"
								bind:value={formData.message}
								placeholder="Beschreiben Sie Ihr Projekt oder Ihre Anfrage..."
								rows="5"
								required
								class="transition-colors focus:ring-2 focus:ring-primary/20"
							/>
						</div>

						<Button
							type="submit"
							size="lg"
							disabled={isSubmitting}
							class="w-full transition-colors"
						>
							{isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}
						</Button>

						<p class="text-xs text-muted-foreground text-center">
							Mit dem Absenden stimmen Sie unserer Datenschutzerklärung zu.
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	</div>
</section>