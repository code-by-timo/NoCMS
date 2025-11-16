<script>
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';

	let { onSelect, onCancel } = $props();

	const sectionTypes = [
		{
			type: 'hero1',
			name: 'Hero 1',
			description: 'Moderner Hero-Bereich mit Gradient-Hintergrund',
			category: 'Hero'
		},
		{
			type: 'hero2',
			name: 'Hero 2',
			description: 'Hero-Bereich mit Hintergrundbild und Feature-Cards',
			category: 'Hero'
		},
		{
			type: 'about1',
			name: 'About 1',
			description: 'Über-uns Section mit Bild und Statistiken',
			category: 'About'
		},
		{
			type: 'about2',
			name: 'About 2',
			description: 'Über-uns Section mit Feature-Grid',
			category: 'About'
		},
		{
			type: 'contact1',
			name: 'Contact 1',
			description: 'Kontakt-Section mit Formular',
			category: 'Contact'
		}
	];

	// Group sections by category
	const groupedSections = $derived(
		sectionTypes.reduce((acc, section) => {
			if (!acc[section.category]) {
				acc[section.category] = [];
			}
			acc[section.category].push(section);
			return acc;
		}, {})
	);
</script>

<div class="h-full flex flex-col">
	<!-- Header with back button -->
	<div class="p-4 border-b flex items-center gap-3">
		<Button variant="ghost" size="icon" onclick={onCancel} aria-label="Zurück">
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
				<path d="m15 18-6-6 6-6" />
			</svg>
		</Button>
		<div>
			<h3 class="font-semibold">Section hinzufügen</h3>
			<p class="text-sm text-muted-foreground">Wählen Sie eine Section aus</p>
		</div>
	</div>

	<!-- Section list -->
	<div class="flex-1 overflow-y-auto p-4 space-y-6">
		{#each Object.entries(groupedSections) as [category, sections]}
			<div class="space-y-3">
				<div class="flex items-center gap-2">
					<Badge variant="outline">{category}</Badge>
					<Separator class="flex-1" />
				</div>

				<div class="space-y-2">
					{#each sections as section}
						<Card
							class="cursor-pointer hover:bg-accent/50 transition-colors"
							onclick={() => onSelect(section.type)}
						>
							<CardHeader class="p-4">
								<CardTitle class="text-base">{section.name}</CardTitle>
								<CardDescription class="text-sm">{section.description}</CardDescription>
							</CardHeader>
						</Card>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
