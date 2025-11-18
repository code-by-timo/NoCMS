<script>
	import RootWrapper from '$lib/components/RootWrapper.svelte';
	import SectionRenderer from '$lib/components/admin/SectionRenderer.svelte';
	import EmptySection from '$lib/components/admin/EmptySection.svelte';
	import SectionSelector from '$lib/components/admin/SectionSelector.svelte';
	import SectionEditor from '$lib/components/admin/SectionEditor.svelte';
	import { pageStore } from '$lib/stores/pageStore.svelte';
	import { GitHubAPI } from '$lib/utils/github-api';
	import { githubConfig } from '$lib/config/github';
	import { onMount, tick } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';

	let isAuthenticated = $state(false);
	let pat = $state('');
	let error = $state('');
	let loading = $state(false);
	let isPublishing = $state(false);
	let publishError = $state('');

	// Canvas state
	let zoom = $state(1);
	let pan = $state({ x: 0, y: 0 });
	let isDragging = $state(false);
	let dragStart = $state({ x: 0, y: 0 });
	/** @type {HTMLElement|null} */
	let canvasElement = $state(/** @type {HTMLElement|null} */ (null));
	/** @type {HTMLDivElement|null} */
	let devicesWrapper = $state(/** @type {HTMLDivElement|null} */ (null));

	// New page dialog state
	let showNewPageDialog = $state(false);
	let newPageName = $state('');
	let newPagePath = $state('');

	const MIN_ZOOM = 0.2;
	const MAX_ZOOM = 2.1;
	const FIT_MARGIN = 0.9;
	const ZOOM_SENSITIVITY = 0.005;
	const LINE_DELTA_MULTIPLIER = 40;
	const PAN_MULTIPLIER = 1.5;
	const WHEEL_GUARD_THRESHOLD = 12;
	const LABEL_BUFFER = 72;

	const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

	/** @param {MouseEvent | WheelEvent} event */
	function pointerRelativeToCanvas(event) {
		if (!canvasElement) return { x: 0, y: 0 };
		const rect = canvasElement.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	}

	// Viewport configurations
	const viewports = [
		{ label: 'Desktop', width: 1200 },
		{ label: 'Tablet', width: 768 },
		{ label: 'Mobile', width: 375 }
	];

	const responsiveBreakpoints = [
		{ prefix: 'sm', min: 640 },
		{ prefix: 'md', min: 768 },
		{ prefix: 'lg', min: 1024 },
		{ prefix: 'xl', min: 1280 },
		{ prefix: '2xl', min: 1536 }
	];

	/** @type {Map<string, ReturnType<typeof createDevicePreviewState>>} */
	const deviceStates = new Map();

	function registerDevice(viewport, element) {
		if (!viewport) return;
		const existing = deviceStates.get(viewport.label);
		if (existing) {
			existing.disconnect();
			deviceStates.delete(viewport.label);
		}

		if (!element) return;

		const state = createDevicePreviewState(element, viewport.width);
		deviceStates.set(viewport.label, state);
	}

	function scheduleAllDevices() {
		for (const state of deviceStates.values()) {
			state.schedule();
		}
	}

	function createDevicePreviewState(element, width) {
		const originalClasses = new WeakMap();
		const appliedClasses = new WeakMap();

		let scheduled = false;
		let disconnected = false;

		function filterClasses() {
			if (disconnected) return;

			const walker = document.createTreeWalker(
				element,
				NodeFilter.SHOW_ELEMENT,
				null
			);

			const elements = [element];
			let node;
			while ((node = walker.nextNode())) {
				if (node instanceof HTMLElement) {
					elements.push(node);
				}
			}

			for (const el of elements) {
				if (!(el instanceof HTMLElement)) continue;

				if (!originalClasses.has(el)) {
					originalClasses.set(el, el.className);
				}

				const original = originalClasses.get(el);
				if (!original) continue;

				const classes = original.split(/\s+/).filter(cls => {
					if (!cls.includes(':')) return true;

					for (const bp of responsiveBreakpoints) {
						if (cls.startsWith(`${bp.prefix}:`)) {
							return width >= bp.min;
						}
						if (cls.startsWith(`max-${bp.prefix}:`)) {
							return width < bp.min;
						}
					}

					return true;
				});

				const newClassName = classes.join(' ');
				if (el.className !== newClassName) {
					el.className = newClassName;
				}
				appliedClasses.set(el, newClassName);
			}

			scheduled = false;
		}

		function schedule() {
			if (scheduled || disconnected) return;
			scheduled = true;
			requestAnimationFrame(filterClasses);
		}

		const observer = new MutationObserver((mutations) => {
			if (disconnected) return;
			for (const mutation of mutations) {
				if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
					const target = mutation.target;
					if (!(target instanceof HTMLElement)) continue;
					const current = appliedClasses.get(target);
					if (current && target.className !== current) {
						originalClasses.set(target, target.className);
						schedule();
					}
				}
			}
			schedule();
		});

		observer.observe(element, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class']
		});

		schedule();

		return {
			schedule,
			disconnect: () => {
				disconnected = true;
				observer.disconnect();
			}
		};
	}

	function devicePreview(node, viewport) {
		registerDevice(viewport, node);
		return {
			destroy() {
				const state = deviceStates.get(viewport?.label);
				if (state) {
					state.disconnect();
					deviceStates.delete(viewport.label);
				}
			}
		};
	}

	/** @param {MouseEvent} event */
	function handleMouseDown(event) {
		if (event.button !== 0) return;
		isDragging = true;
		dragStart = { x: event.clientX - pan.x, y: event.clientY - pan.y };
	}

	/** @param {MouseEvent} event */
	function handleMouseMove(event) {
		if (!isDragging) return;
		pan = {
			x: event.clientX - dragStart.x,
			y: event.clientY - dragStart.y
		};
	}

	function handleMouseUp() {
		isDragging = false;
	}

	/** @param {WheelEvent} event */
	function handleWheel(event) {
		event.preventDefault();

		const deltaY = event.deltaMode === WheelEvent.DOM_DELTA_LINE
			? event.deltaY * LINE_DELTA_MULTIPLIER
			: event.deltaY;

		const absY = Math.abs(deltaY);
		const absX = Math.abs(event.deltaX);
		const shouldZoom = (event.ctrlKey || event.metaKey) || absX < WHEEL_GUARD_THRESHOLD;

		if (shouldZoom) {
			const pointer = pointerRelativeToCanvas(event);
			const scaledPoint = {
				x: (pointer.x - pan.x) / zoom,
				y: (pointer.y - pan.y) / zoom
			};
			const delta = -deltaY * ZOOM_SENSITIVITY;
			const newZoom = clamp(zoom + delta, MIN_ZOOM, MAX_ZOOM);
			const zoomRatio = newZoom / zoom;

			pan = {
				x: pointer.x - scaledPoint.x * newZoom,
				y: pointer.y - scaledPoint.y * newZoom
			};
			zoom = newZoom;
		} else {
			pan = {
				x: pan.x - event.deltaX * PAN_MULTIPLIER,
				y: pan.y - deltaY * PAN_MULTIPLIER
			};
		}
	}

	async function fitToView() {
		if (!canvasElement || !devicesWrapper) return;

		await tick();

		const canvasRect = canvasElement.getBoundingClientRect();
		const devicesRect = devicesWrapper.getBoundingClientRect();

		const availableWidth = canvasRect.width;
		const availableHeight = canvasRect.height;
		const contentWidth = viewports[0].width;
		const contentHeight = devicesRect.height / zoom;

		const scaleX = (availableWidth * FIT_MARGIN) / contentWidth;
		const scaleY = (availableHeight * FIT_MARGIN) / contentHeight;
		const newZoom = clamp(Math.min(scaleX, scaleY), MIN_ZOOM, MAX_ZOOM);

		const scaledWidth = contentWidth * newZoom;
		const scaledHeight = contentHeight * newZoom;

		pan = {
			x: (availableWidth - scaledWidth) / 2,
			y: (availableHeight - scaledHeight - LABEL_BUFFER) / 2
		};
		zoom = newZoom;
	}

	async function handleLogin() {
		loading = true;
		error = '';

		try {
			const githubAPI = new GitHubAPI(pat, githubConfig);
			const isValid = await githubAPI.validatePAT();

			if (isValid) {
				localStorage.setItem('github_pat', pat);
				isAuthenticated = true;

				// Load pages from GitHub after successful login
				await pageStore.loadFromGitHub(pat, githubConfig);
			} else {
				error = 'Ungültiger Access Token';
			}
		} catch (e) {
			error = 'Fehler beim Verbinden mit GitHub';
		} finally {
			loading = false;
		}
	}

	function handleLogout() {
		localStorage.removeItem('github_pat');
		isAuthenticated = false;
		pat = '';
	}

	function handleAddPage() {
		if (!newPageName.trim() || !newPagePath.trim()) return;

		pageStore.addPage(newPageName, newPagePath);
		newPageName = '';
		newPagePath = '';
		showNewPageDialog = false;
	}

	function handleAddSection(pageId) {
		pageStore.toggleAddSectionMode();
	}

	function handleSectionSelect(sectionType) {
		if (!pageStore.currentPageId) return;
		pageStore.addSection(pageStore.currentPageId, sectionType);
	}

	function handleSectionDelete(pageId, sectionId) {
		pageStore.deleteSection(pageId, sectionId);
	}

	function handleSectionClick(sectionId) {
		pageStore.selectSection(sectionId);
	}

	function handleSectionUpdate(newProps) {
		if (!pageStore.currentPageId || !pageStore.selectedSectionId) return;
		pageStore.updateSection(pageStore.currentPageId, pageStore.selectedSectionId, newProps);
	}

	function handleCloseEditor() {
		pageStore.selectSection(null);
	}

	function handleUndo() {
		pageStore.undo();
	}

	function handleRedo() {
		pageStore.redo();
	}

	async function handlePublish() {
		if (!pat || isPublishing) return;

		isPublishing = true;
		publishError = '';

		try {
			// Create GitHub API instance
			const githubAPI = new GitHubAPI(pat, githubConfig);

			// Prepare the pages.json content
			const pagesContent = JSON.stringify(pageStore.pages, null, 2);

			// Commit and push to GitHub
			await githubAPI.commitAndPush(
				'src/data/pages.json',
				pagesContent,
				'Update pages from CMS'
			);

			// Update local pages.json (for dev server)
			try {
				await fetch('/api/update-local-pages', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(pageStore.pages)
				});
			} catch {
				// Silently fail if dev server is not running
			}

			// Mark as published
			pageStore.markAsPublished();
		} catch (err) {
			publishError = err instanceof Error ? err.message : 'Failed to publish';
			console.error('Publish error:', err);
		} finally {
			isPublishing = false;
		}
	}

	// Auto-save to localStorage
	$effect(() => {
		pageStore.saveToLocalStorage();
	});

	onMount(async () => {
		const storedPat = localStorage.getItem('github_pat');
		if (storedPat) {
			pat = storedPat;
			await handleLogin();
		}

		// Fit to view after mount
		setTimeout(fitToView, 100);
	});
</script>

{#if !isAuthenticated}
	<!-- Login View -->
	<div class="flex min-h-screen items-center justify-center bg-muted/40">
		<Card class="w-full max-w-md">
			<CardHeader>
				<CardTitle>Admin Login</CardTitle>
				<CardDescription>
					Geben Sie Ihren GitHub Personal Access Token ein
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onsubmit={(e) => { e.preventDefault(); handleLogin(); }} class="space-y-4">
					<div class="space-y-2">
						<Label for="pat">GitHub Personal Access Token</Label>
						<Input
							id="pat"
							type="password"
							bind:value={pat}
							placeholder="ghp_xxxxxxxxxxxxx"
							disabled={loading}
						/>
					</div>

					{#if error}
						<div class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
							{error}
						</div>
					{/if}

					<Button type="submit" class="w-full" disabled={loading}>
						{loading ? 'Wird geprüft...' : 'Anmelden'}
					</Button>
				</form>
			</CardContent>
		</Card>
	</div>
{:else}
	<!-- Admin Panel View -->
	<div class="flex h-screen flex-col bg-background">
		<!-- Top Bar -->
		<header class="flex h-14 items-center justify-between border-b bg-card px-6">
			<div class="flex items-center gap-4">
				<h1 class="text-lg font-semibold">Admin Panel</h1>

				<!-- Undo/Redo Buttons -->
				<div class="flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon-sm"
						onclick={handleUndo}
						disabled={!pageStore.canUndo}
						title="Rückgängig (Cmd+Z)"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M3 7v6h6"/>
							<path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
						</svg>
					</Button>
					<Button
						variant="ghost"
						size="icon-sm"
						onclick={handleRedo}
						disabled={!pageStore.canRedo}
						title="Wiederholen (Cmd+Shift+Z)"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M21 7v6h-6"/>
							<path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/>
						</svg>
					</Button>
				</div>

				{#if pageStore.isDirty}
					<span class="text-xs text-muted-foreground">• Ungespeicherte Änderungen</span>
				{/if}
			</div>

			<div class="flex items-center gap-2">
				{#if publishError}
					<span class="text-xs text-destructive">{publishError}</span>
				{/if}
				<Button
					variant="default"
					size="sm"
					disabled={!pageStore.isDirty || isPublishing}
					onclick={handlePublish}
				>
					{isPublishing ? 'Publishing...' : 'Publish'}
				</Button>
				<Button variant="outline" size="sm" onclick={handleLogout}>
					Abmelden
				</Button>
			</div>
		</header>

		<!-- Main Content Area -->
		<div class="flex flex-1 overflow-hidden">
			<!-- Left Sidebar -->
			<aside class="w-64 border-r bg-card">
				<div class="flex h-full flex-col p-4">
					<div class="mb-4 flex items-center justify-between">
						<div class="px-3 text-xs font-semibold uppercase text-muted-foreground">
							Seiten
						</div>
						<Button
							variant="ghost"
							size="icon-sm"
							onclick={() => showNewPageDialog = !showNewPageDialog}
							title="Neue Seite"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M5 12h14"/>
								<path d="M12 5v14"/>
							</svg>
						</Button>
					</div>

					{#if showNewPageDialog}
						<Card class="mb-4">
							<CardContent class="p-4 space-y-3">
								<div class="space-y-2">
									<Label for="page-name" class="text-xs">Seitenname</Label>
									<Input
										id="page-name"
										bind:value={newPageName}
										placeholder="z.B. Über uns"
										class="h-8 text-sm"
									/>
								</div>
								<div class="space-y-2">
									<Label for="page-path" class="text-xs">Pfad</Label>
									<Input
										id="page-path"
										bind:value={newPagePath}
										placeholder="z.B. /ueber-uns"
										class="h-8 text-sm"
									/>
								</div>
								<div class="flex gap-2">
									<Button size="sm" onclick={handleAddPage} class="flex-1">
										Erstellen
									</Button>
									<Button size="sm" variant="ghost" onclick={() => showNewPageDialog = false} class="flex-1">
										Abbrechen
									</Button>
								</div>
							</CardContent>
						</Card>
					{/if}

					<nav class="space-y-1">
						{#if pageStore.isLoading}
							<div class="flex items-center justify-center py-8">
								<div class="text-sm text-muted-foreground">Lade Seiten...</div>
							</div>
						{:else if pageStore.pages.length === 0}
							<div class="flex items-center justify-center py-8 text-center">
								<div class="text-sm text-muted-foreground">
									Keine Seiten vorhanden.<br />
									Erstelle eine neue Seite.
								</div>
							</div>
						{:else}
							{#each pageStore.pages as page}
								<button
									onclick={() => pageStore.setCurrentPage(page.id)}
									class="w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent {pageStore.currentPageId === page.id ? 'bg-accent font-medium' : ''}"
								>
									{page.label}
								</button>
							{/each}
						{/if}
					</nav>
				</div>
			</aside>

			<!-- Canvas Container -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<div
				bind:this={canvasElement}
				role="region"
				aria-label="Device canvas"
				tabindex="0"
				class="relative flex-1 overflow-hidden overscroll-contain bg-muted"
				onmousedown={handleMouseDown}
				onmousemove={handleMouseMove}
				onmouseup={handleMouseUp}
				onmouseleave={handleMouseUp}
				onwheel={handleWheel}
				style="cursor: {isDragging ? 'grabbing' : 'grab'}; touch-action: none;"
			>
				<!-- Zoom Indicator -->
				<div class="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-md bg-card/90 px-3 py-2 text-sm shadow-lg backdrop-blur-sm">
					<span class="text-muted-foreground">{Math.round(zoom * 100)}%</span>
				</div>

				<!-- Canvas Content -->
				<div
					class="absolute inset-0"
					style="transform: translate({pan.x}px, {pan.y}px);"
				>
					<div
					bind:this={devicesWrapper}
					class="flex items-start gap-32 p-24"
					style="transform: scale({zoom}); transform-origin: 0 0; transition: transform 0.08s cubic-bezier(0.16, 1, 0.3, 1);"
					>
						{#each viewports as viewport}
							<div class="flex flex-col items-center gap-6">
								<div class="rounded-md bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
									{viewport.label}
								</div>

								<div
									use:devicePreview={viewport}
									class="admin-device overflow-hidden rounded-lg bg-background shadow-2xl"
									style="width: {viewport.width}px; --preview-100vh: 600px;"
								>
									<RootWrapper preview={true}>
										{#if pageStore.currentPage}
											{#each pageStore.currentPage.sections as section}
												<SectionRenderer
													{section}
													isSelected={section.id === pageStore.selectedSectionId}
													onClick={() => handleSectionClick(section.id)}
													onDelete={() => handleSectionDelete(pageStore.currentPageId, section.id)}
												/>
											{/each}

											<!-- Empty section at the end -->
											<EmptySection onAddSection={() => handleAddSection(pageStore.currentPageId)} />
										{:else}
											<div class="flex min-h-screen items-center justify-center text-muted-foreground">
												Keine Seite ausgewählt
											</div>
										{/if}
									</RootWrapper>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Right Sidebar -->
			<aside class="w-64 border-l bg-card">
				{#if pageStore.selectedSection}
					<SectionEditor
						section={pageStore.selectedSection}
						onUpdate={handleSectionUpdate}
						onClose={handleCloseEditor}
					/>
				{:else if pageStore.isAddingSectionMode}
					<SectionSelector
						onSelect={handleSectionSelect}
						onCancel={() => pageStore.toggleAddSectionMode()}
					/>
				{:else}
					<div class="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
						Klicken Sie auf eine Section zum Bearbeiten oder auf "+ Section" um hinzuzufügen
					</div>
				{/if}
			</aside>
		</div>
	</div>
{/if}
