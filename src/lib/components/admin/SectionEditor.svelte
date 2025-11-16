<script>
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';

	let { section, onUpdate, onClose } = $props();

	// Define editable fields for each section type
	const sectionFields = {
		hero1: [
			{ key: 'badge', label: 'Badge', type: 'text' },
			{ key: 'title', label: 'Titel', type: 'text' },
			{ key: 'titleHighlight', label: 'Titel Highlight', type: 'text' },
			{ key: 'description', label: 'Beschreibung', type: 'textarea' },
			{ key: 'primaryButtonText', label: 'Primary Button Text', type: 'text' },
			{ key: 'primaryButtonLink', label: 'Primary Button Link', type: 'text' },
			{ key: 'secondaryButtonText', label: 'Secondary Button Text', type: 'text' },
			{ key: 'secondaryButtonLink', label: 'Secondary Button Link', type: 'text' }
		],
		hero2: [
			{ key: 'badge', label: 'Badge', type: 'text' },
			{ key: 'title', label: 'Titel', type: 'text' },
			{ key: 'titleHighlight', label: 'Titel Highlight', type: 'text' },
			{ key: 'titleSuffix', label: 'Titel Suffix', type: 'text' },
			{ key: 'description', label: 'Beschreibung', type: 'textarea' },
			{ key: 'primaryButtonText', label: 'Primary Button Text', type: 'text' },
			{ key: 'primaryButtonLink', label: 'Primary Button Link', type: 'text' },
			{ key: 'secondaryButtonText', label: 'Secondary Button Text', type: 'text' },
			{ key: 'secondaryButtonLink', label: 'Secondary Button Link', type: 'text' }
		],
		about1: [
			{ key: 'badge', label: 'Badge', type: 'text' },
			{ key: 'title', label: 'Titel', type: 'text' },
			{ key: 'description', label: 'Beschreibung', type: 'textarea' },
			{ key: 'buttonText', label: 'Button Text', type: 'text' },
			{ key: 'buttonLink', label: 'Button Link', type: 'text' }
		],
		about2: [
			{ key: 'badge', label: 'Badge', type: 'text' },
			{ key: 'title', label: 'Titel', type: 'text' },
			{ key: 'description', label: 'Beschreibung', type: 'textarea' }
		],
		contact1: [
			{ key: 'badge', label: 'Badge', type: 'text' },
			{ key: 'title', label: 'Titel', type: 'text' },
			{ key: 'description', label: 'Beschreibung', type: 'textarea' }
		]
	};

	const fields = $derived(sectionFields[section.type] || []);

	// Get section type display name
	const sectionTypeNames = {
		hero1: 'Hero 1',
		hero2: 'Hero 2',
		about1: 'About 1',
		about2: 'About 2',
		contact1: 'Contact 1'
	};

	const sectionTypeName = $derived(sectionTypeNames[section.type] || section.type);

	// Handle input changes - directly update parent
	function handleChange(key, value) {
		onUpdate({
			...section.props,
			[key]: value
		});
	}
</script>

<div class="h-full flex flex-col">
	<!-- Header with close button -->
	<div class="p-4 border-b flex items-center gap-3">
		<Button variant="ghost" size="icon" onclick={onClose} aria-label="Schließen">
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
				<path d="M18 6 6 18" />
				<path d="m6 6 12 12" />
			</svg>
		</Button>
		<div>
			<h3 class="font-semibold">Section bearbeiten</h3>
			<p class="text-sm text-muted-foreground">{sectionTypeName}</p>
		</div>
	</div>

	<!-- Editor form -->
	<div class="flex-1 overflow-y-auto p-4 space-y-4">
		{#each fields as field}
			<div class="space-y-2">
				<Label for={field.key} class="text-sm">{field.label}</Label>
				{#if field.type === 'textarea'}
					<Textarea
						id={field.key}
						value={section.props[field.key] || ''}
						oninput={(e) => handleChange(field.key, e.target.value)}
						rows={3}
						class="text-sm"
					/>
				{:else}
					<Input
						id={field.key}
						type="text"
						value={section.props[field.key] || ''}
						oninput={(e) => handleChange(field.key, e.target.value)}
						class="text-sm"
					/>
				{/if}
			</div>
		{/each}

		{#if fields.length === 0}
			<div class="text-center text-sm text-muted-foreground py-8">
				Keine editierbaren Felder für diesen Section-Typ
			</div>
		{/if}
	</div>

	<Separator />

	<!-- Footer with section info -->
	<div class="p-4 bg-muted/20">
		<p class="text-xs text-muted-foreground">
			ID: <code class="bg-muted px-1 py-0.5 rounded text-xs">{section.id}</code>
		</p>
		<p class="text-xs text-muted-foreground mt-1">
			Änderungen werden automatisch gespeichert
		</p>
	</div>
</div>
