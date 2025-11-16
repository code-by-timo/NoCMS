// Page Store - Central state management for CMS pages and sections
// Uses Svelte 5 runes for reactive state

export type SectionType = 'hero1' | 'hero2' | 'about1' | 'about2' | 'contact1';

export interface Section {
	id: string;
	type: SectionType;
	props: Record<string, any>;
}

export interface Page {
	id: string;
	path: string;
	label: string;
	sections: Section[];
}

interface HistoryEntry {
	pages: Page[];
	timestamp: number;
}

class PageStore {
	pages = $state<Page[]>([]);
	currentPageId = $state<string | null>(null);
	selectedSectionId = $state<string | null>(null); // Track selected section for editing
	history = $state<HistoryEntry[]>([]);
	historyIndex = $state(-1);
	isDirty = $state(false);
	isAddingSectionMode = $state(false); // Track if we're in "add section" mode

	constructor() {
		// Initialize with existing pages (migrated from hardcoded structure)
		this.pages = [
			{
				id: 'home',
				path: '/',
				label: 'Home',
				sections: [
					{ id: 'home-hero', type: 'hero1', props: {} },
					{ id: 'home-about', type: 'about1', props: {} },
					{ id: 'home-contact', type: 'contact1', props: {} }
				]
			},
			{
				id: 'ueber-mich',
				path: '/ueber-mich',
				label: 'Über Mich',
				sections: [
					{ id: 'ueber-hero', type: 'hero2', props: {} },
					{ id: 'ueber-about', type: 'about2', props: {} }
				]
			},
			{
				id: 'kontakt',
				path: '/kontakt',
				label: 'Kontakt',
				sections: [{ id: 'kontakt-contact', type: 'contact1', props: {} }]
			}
		];

		// Set first page as current
		if (this.pages.length > 0) {
			this.currentPageId = this.pages[0].id;
		}

		// Initialize history
		this.saveToHistory();
	}

	// Get current page (derived)
	get currentPage(): Page | null {
		return this.pages.find((p) => p.id === this.currentPageId) ?? null;
	}

	// History management
	saveToHistory() {
		// Remove any history after current index (when making new changes after undo)
		this.history = this.history.slice(0, this.historyIndex + 1);

		// Add current state to history
		this.history.push({
			pages: JSON.parse(JSON.stringify(this.pages)),
			timestamp: Date.now()
		});

		this.historyIndex = this.history.length - 1;

		// Limit history to 50 entries
		if (this.history.length > 50) {
			this.history.shift();
			this.historyIndex--;
		}
	}

	undo() {
		if (this.historyIndex > 0) {
			this.historyIndex--;
			this.pages = JSON.parse(JSON.stringify(this.history[this.historyIndex].pages));
			this.isDirty = true;
		}
	}

	redo() {
		if (this.historyIndex < this.history.length - 1) {
			this.historyIndex++;
			this.pages = JSON.parse(JSON.stringify(this.history[this.historyIndex].pages));
			this.isDirty = true;
		}
	}

	get canUndo(): boolean {
		return this.historyIndex > 0;
	}

	get canRedo(): boolean {
		return this.historyIndex < this.history.length - 1;
	}

	// Page management
	addPage(label: string, path: string) {
		const id = path.replace(/\//g, '') || 'home';

		const newPage: Page = {
			id,
			path,
			label,
			sections: [] // Start with empty sections array
		};

		this.pages.push(newPage);
		this.currentPageId = id;
		this.saveToHistory();
		this.isDirty = true;
	}

	deletePage(pageId: string) {
		const index = this.pages.findIndex((p) => p.id === pageId);
		if (index !== -1) {
			this.pages.splice(index, 1);

			// Update current page if deleted
			if (this.currentPageId === pageId) {
				this.currentPageId = this.pages[0]?.id ?? null;
			}

			this.saveToHistory();
			this.isDirty = true;
		}
	}

	setCurrentPage(pageId: string) {
		this.currentPageId = pageId;
		this.isAddingSectionMode = false; // Exit add section mode when changing pages
		this.selectedSectionId = null; // Deselect section when changing pages
	}

	// Select a section for editing
	selectSection(sectionId: string | null) {
		this.selectedSectionId = sectionId;
		this.isAddingSectionMode = false; // Exit add section mode when selecting a section
	}

	// Get currently selected section
	get selectedSection(): Section | null {
		if (!this.currentPage || !this.selectedSectionId) return null;
		return this.currentPage.sections.find((s) => s.id === this.selectedSectionId) ?? null;
	}

	// Section management
	addSection(pageId: string, sectionType: SectionType) {
		const page = this.pages.find((p) => p.id === pageId);
		if (!page) return;

		const newSection: Section = {
			id: `${pageId}-${sectionType}-${Date.now()}`,
			type: sectionType,
			props: this.getDefaultProps(sectionType)
		};

		page.sections.push(newSection);
		this.saveToHistory();
		this.isDirty = true;
		this.isAddingSectionMode = false; // Exit add section mode after adding
	}

	deleteSection(pageId: string, sectionId: string) {
		const page = this.pages.find((p) => p.id === pageId);
		if (!page) return;

		const index = page.sections.findIndex((s) => s.id === sectionId);
		if (index !== -1) {
			page.sections.splice(index, 1);
			this.saveToHistory();
			this.isDirty = true;
		}
	}

	updateSection(pageId: string, sectionId: string, newProps: Record<string, any>) {
		const page = this.pages.find((p) => p.id === pageId);
		if (!page) return;

		const section = page.sections.find((s) => s.id === sectionId);
		if (!section) return;

		section.props = { ...section.props, ...newProps };
		this.saveToHistory();
		this.isDirty = true;
	}

	moveSection(pageId: string, fromIndex: number, toIndex: number) {
		const page = this.pages.find((p) => p.id === pageId);
		if (!page) return;

		const [section] = page.sections.splice(fromIndex, 1);
		page.sections.splice(toIndex, 0, section);
		this.saveToHistory();
		this.isDirty = true;
	}

	// Get default props for each section type
	private getDefaultProps(type: SectionType): Record<string, any> {
		const defaults: Record<SectionType, Record<string, any>> = {
			hero1: {
				title: 'Willkommen',
				subtitle: 'Dies ist ein neuer Hero-Bereich',
				buttonText: 'Mehr erfahren',
				buttonLink: '#'
			},
			hero2: {
				title: 'Willkommen',
				subtitle: 'Dies ist ein neuer Hero-Bereich',
				buttonText: 'Mehr erfahren',
				buttonLink: '#'
			},
			about1: {
				title: 'Über uns',
				description: 'Beschreibung hier einfügen',
				buttonText: 'Mehr erfahren',
				buttonLink: '#'
			},
			about2: {
				title: 'Über uns',
				description: 'Beschreibung hier einfügen',
				buttonText: 'Mehr erfahren',
				buttonLink: '#'
			},
			contact1: {
				title: 'Kontakt',
				description: 'Nehmen Sie Kontakt mit uns auf'
			}
		};

		return defaults[type] || {};
	}

	// Toggle add section mode
	toggleAddSectionMode() {
		this.isAddingSectionMode = !this.isAddingSectionMode;
		this.selectedSectionId = null; // Deselect section when entering add mode
	}

	// Save/Load from localStorage
	saveToLocalStorage() {
		try {
			localStorage.setItem('nocms-draft-pages', JSON.stringify(this.pages));
		} catch (e) {
			console.error('Failed to save to localStorage:', e);
		}
	}

	loadFromLocalStorage(): boolean {
		try {
			const stored = localStorage.getItem('nocms-draft-pages');
			if (stored) {
				this.pages = JSON.parse(stored);
				if (this.pages.length > 0) {
					this.currentPageId = this.pages[0].id;
				}
				this.saveToHistory();
				return true;
			}
		} catch (e) {
			console.error('Failed to load from localStorage:', e);
		}
		return false;
	}

	// Mark as published (clear dirty flag)
	markAsPublished() {
		this.isDirty = false;
	}
}

// Export singleton instance
export const pageStore = new PageStore();
