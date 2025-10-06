<script>
	import RootWrapper from '$lib/components/RootWrapper.svelte';
	import { onMount, tick } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';

	// Import page components
	import HomePage from '../(pages)/+page.svelte';
	import UeberMichPage from '../(pages)/ueber-mich/+page.svelte';
	import KontaktPage from '../(pages)/kontakt/+page.svelte';

	let isAuthenticated = $state(false);
	let pat = $state('');
	let error = $state('');
	let loading = $state(false);
	let selectedPath = $state('/');

	// Canvas state
	let zoom = $state(1);
	let pan = $state({ x: 0, y: 0 });
	let isDragging = $state(false);
	let dragStart = $state({ x: 0, y: 0 });
	/** @type {HTMLElement|null} */
	let canvasElement = $state(/** @type {HTMLElement|null} */ (null));
	/** @type {HTMLDivElement|null} */
	let devicesWrapper = $state(/** @type {HTMLDivElement|null} */ (null));

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

	// Page configuration
	const pages = [
		{ path: '/', label: 'Home', component: HomePage },
		{ path: '/ueber-mich', label: 'Über Mich', component: UeberMichPage },
		{ path: '/kontakt', label: 'Kontakt', component: KontaktPage }
	];

	// Get current page component
	let CurrentPageComponent = $derived(
		pages.find(p => p.path === selectedPath)?.component || HomePage
	);

	onMount(() => {
		const storedPat = localStorage.getItem('github_pat');
		if (storedPat) {
			isAuthenticated = true;
			pat = storedPat;
		}
	});

	async function handleLogin() {
		if (!pat.trim()) {
			error = 'Bitte geben Sie einen GitHub Personal Access Token ein';
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await fetch('https://api.github.com/repos/knuspermixx/NoCMS', {
				headers: {
					Authorization: `Bearer ${pat}`,
					Accept: 'application/vnd.github.v3+json'
				}
			});

			if (!response.ok) {
				throw new Error('Ungültiger Token oder keine Berechtigung');
			}

			localStorage.setItem('github_pat', pat);
			isAuthenticated = true;
		} catch {
			error = 'Authentifizierung fehlgeschlagen. Bitte überprüfen Sie Ihren Token und Repository-Zugriff.';
		} finally {
			loading = false;
		}
	}

	function handleLogout() {
		localStorage.removeItem('github_pat');
		isAuthenticated = false;
		pat = '';
		selectedPath = '/';
	}

	// Canvas Pan functionality
	/** @param {MouseEvent} e */
	function handleMouseDown(e) {
		if (!canvasElement) return;
		e.preventDefault();
		canvasElement.focus();
		isDragging = true;
		dragStart = { x: e.clientX - pan.x, y: e.clientY - pan.y };
	}

	/** @param {MouseEvent} e */
	function handleMouseMove(e) {
		if (!isDragging) return;
		pan = {
			x: e.clientX - dragStart.x,
			y: e.clientY - dragStart.y
		};
	}

	function handleMouseUp() {
		isDragging = false;
	}

	// Canvas Scroll functionality
	/** @param {WheelEvent} event */
	function handleWheel(event) {
		event.preventDefault();
		if (!canvasElement) return;

		const position = pointerRelativeToCanvas(event);
		const isZoomGesture = event.ctrlKey || event.metaKey;
		const multiplier = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? LINE_DELTA_MULTIPLIER : 1;
		const deltaX = event.deltaX * multiplier;
		const deltaY = event.deltaY * multiplier;

		if (isZoomGesture) {
			const zoomFactor = Math.pow(2, -deltaY * ZOOM_SENSITIVITY);
			const nextZoom = clamp(zoom * zoomFactor, MIN_ZOOM, MAX_ZOOM);
			const contentX = (position.x - pan.x) / zoom;
			const contentY = (position.y - pan.y) / zoom;

			pan = {
				x: position.x - contentX * nextZoom,
				y: position.y - contentY * nextZoom
			};

			zoom = nextZoom;
		} else {
			if (Math.abs(deltaX) > WHEEL_GUARD_THRESHOLD || Math.abs(deltaY) > WHEEL_GUARD_THRESHOLD) {
				event.preventDefault();
			}
			pan = {
				x: pan.x - deltaX * PAN_MULTIPLIER,
				y: pan.y - deltaY * PAN_MULTIPLIER
			};
		}
	}

	/** @param {number} width */
	function deviceHeightForWidth(width) {
		if (width <= 480) return 812; // small/mobile
		if (width <= 1024) return 1024; // tablet
		return 900; // desktop
	}

	function fitDesktopToCanvas() {
		if (typeof window === 'undefined') return;
		if (!canvasElement || !devicesWrapper) return;

		const canvasRect = canvasElement.getBoundingClientRect();
		if (canvasRect.width === 0 || canvasRect.height === 0) return;

		const styles = window.getComputedStyle(devicesWrapper);
		const paddingLeft = parseFloat(styles.paddingLeft) || 0;
		const paddingRight = parseFloat(styles.paddingRight) || 0;
		const paddingTop = parseFloat(styles.paddingTop) || 0;
		const paddingBottom = parseFloat(styles.paddingBottom) || 0;

		const desktopViewport = viewports[0];
		const desktopWidth = desktopViewport.width;
		const desktopHeight = deviceHeightForWidth(desktopWidth);

		const baseWidth = desktopWidth + paddingLeft + paddingRight;
		const baseHeight = desktopHeight + paddingTop + paddingBottom + LABEL_BUFFER;

		const targetZoom = clamp(
			Math.min(
				canvasRect.width / baseWidth,
				canvasRect.height / baseHeight
			) * FIT_MARGIN,
			MIN_ZOOM,
			MAX_ZOOM
		);

		const desktopCenterX = paddingLeft + desktopWidth / 2;
		const desktopCenterY = paddingTop + LABEL_BUFFER + desktopHeight / 2;

		const nextPan = {
			x: canvasRect.width / 2 - desktopCenterX * targetZoom,
			y: canvasRect.height / 2 - desktopCenterY * targetZoom
		};

		zoom = targetZoom;
		pan = nextPan;
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		const element = canvasElement;
		const content = devicesWrapper;
		if (!element || !content) return;

		const resize = () => fitDesktopToCanvas();
		resize();

		const observer = new ResizeObserver(resize);
		observer.observe(element);
		observer.observe(content);
		window.addEventListener('resize', resize);

		return () => {
			observer.disconnect();
			window.removeEventListener('resize', resize);
		};
	});

	$effect(async () => {
		selectedPath;
		await tick();
		fitDesktopToCanvas();
	});


	// Simpler approach: don't run DOM-parsing JS. Instead use CSS-based preview rules
	// that scope common viewport-driven utilities inside `.admin-device`. This avoids
	// modifying components and keeps the admin preview lightweight.
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
			<h1 class="text-lg font-semibold">Admin Panel</h1>
			<Button variant="outline" size="sm" onclick={handleLogout}>
				Abmelden
			</Button>
		</header>

		<!-- Main Content Area -->
		<div class="flex flex-1 overflow-hidden">
			<!-- Left Sidebar -->
			<aside class="w-64 border-r bg-card">
				<div class="flex h-full flex-col p-4">
					<nav class="space-y-1">
						<div class="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
							Seiten
						</div>
						{#each pages as pageItem}
							<button
								onclick={() => selectedPath = pageItem.path}
								class="w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent {selectedPath === pageItem.path ? 'bg-accent font-medium' : ''}"
							>
								{pageItem.label}
							</button>
						{/each}
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
							<div class="flex flex-col gap-5">
								<div class="text-center text-sm font-medium text-muted-foreground">
									{viewport.label} ({viewport.width}px)
								</div>
								<div class="admin-device" style="width: {viewport.width}px; --preview-100vh: {deviceHeightForWidth(viewport.width)}px; overflow:visible; transform: translateZ(0); position:relative;">
									<RootWrapper preview={true}>
										<CurrentPageComponent />
									</RootWrapper>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Right Sidebar -->
			<aside class="w-64 border-l bg-card">
				<div class="p-4">
					<div class="text-sm text-muted-foreground">
						<!-- Tools/widgets can be added here -->
					</div>
				</div>
			</aside>
		</div>
	</div>
{/if}

<!-- admin preview CSS moved to global stylesheet -->
