<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { ArrowRight } from '@lucide/svelte';
	import { operators, ROLES, SQUADS } from '$lib/data';
	import { applyFilters, emptyFilters, parseFilters, serializeFilters } from '$lib/filters';
	import { favorites } from '$lib/favorites.svelte';
	import type { Operator } from '$lib/types';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import OperatorTile from '$lib/components/OperatorTile.svelte';
	import OperatorPreview from '$lib/components/OperatorPreview.svelte';
	import PreviewSheet from '$lib/components/PreviewSheet.svelte';

	// The page is prerendered, so the query string is only read once we are in the browser.
	let filters = $state(emptyFilters());
	let ready = $state(false);
	// Track slugs, not objects: $state would proxy them and break identity checks.
	let hoveredSlug = $state<string | null>(null);
	let sheetSlug = $state<string | null>(null);
	let grid = $state<HTMLUListElement>();

	const visible = $derived(applyFilters(operators, filters, favorites.slugs));
	const featured = $derived(
		visible.find((op) => op.slug === hoveredSlug) ?? visible[0] ?? operators[0]
	);
	const sheetOperator = $derived(operators.find((op) => op.slug === sheetSlug) ?? null);
	const newest = [...operators].sort((a, b) => b.season.order - a.season.order)[0];
	const counts = $derived({
		all: operators.length,
		attack: operators.filter((o) => o.side === 'attack').length,
		defense: operators.filter((o) => o.side === 'defense').length,
		shown: visible.length
	});

	onMount(() => {
		favorites.init();
		filters = parseFilters(new URLSearchParams(location.search));
		ready = true;
	});

	$effect(() => {
		const query = serializeFilters(filters).toString();
		if (!untrack(() => ready)) return;
		if (query !== location.search.slice(1))
			replaceState(query ? `?${query}` : location.pathname, {});
	});

	// Below the desktop breakpoint there is no side panel, so a tap opens the bottom sheet first.
	function select(op: Operator, event: MouseEvent) {
		if (matchMedia('(min-width: 1024px)').matches || event.metaKey || event.ctrlKey) return;
		event.preventDefault();
		sheetSlug = op.slug;
	}

	const STEP: Record<string, (cols: number) => number> = {
		ArrowRight: () => 1,
		ArrowLeft: () => -1,
		ArrowDown: (cols) => cols,
		ArrowUp: (cols) => -cols
	};

	// Arrow keys move focus around the grid; focusing a tile also updates the preview.
	function navigate(event: KeyboardEvent) {
		if (!grid || !(event.key in STEP || event.key === 'Home' || event.key === 'End')) return;
		const tiles = [...grid.querySelectorAll<HTMLAnchorElement>('a[data-tile]')];
		const current = tiles.indexOf(document.activeElement as HTMLAnchorElement);
		if (current === -1) return;
		const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
		const next =
			event.key === 'Home'
				? 0
				: event.key === 'End'
					? tiles.length - 1
					: current + STEP[event.key](cols);
		if (next < 0 || next >= tiles.length) return;
		event.preventDefault();
		tiles[next].focus();
		tiles[next].scrollIntoView({ block: 'nearest' });
	}
</script>

<svelte:head>
	<title>Select Operator — R6 Intel</title>
	<meta
		name="description"
		content="Browse all {operators.length} Rainbow Six Siege operators: loadouts, gadgets, roles and biographies."
	/>
</svelte:head>

<!-- Scene light follows the featured operator's side. -->
<div class="pointer-events-none fixed inset-0 -z-[1]" aria-hidden="true">
	<div
		class="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_80%_20%,color-mix(in_oklab,var(--color-attack)_22%,transparent),transparent_70%)] transition-opacity duration-700 {featured.side ===
		'attack'
			? 'opacity-100'
			: 'opacity-0'}"
	></div>
	<div
		class="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_80%_20%,color-mix(in_oklab,var(--color-defense)_22%,transparent),transparent_70%)] transition-opacity duration-700 {featured.side ===
		'defense'
			? 'opacity-100'
			: 'opacity-0'}"
	></div>
</div>

<section class="flex flex-wrap items-end justify-between gap-4 pt-4 pb-6">
	<div>
		<p class="font-mono text-xs tracking-[0.3em] text-attack uppercase">
			// Rainbow Six Siege X · {operators.length} operators
		</p>
		<h1
			class="mt-1 font-display text-5xl leading-none font-bold tracking-wide uppercase sm:text-7xl"
		>
			Select <span class="text-outline [-webkit-text-stroke:1px_var(--color-fg)]">operator</span>
		</h1>
	</div>

	<a
		href="/operators/{newest.slug}"
		class="group hud relative flex items-center gap-4 overflow-hidden border border-line bg-surface/70 py-2 pr-5 pl-2 backdrop-blur transition hover:border-(--side) {newest.side ===
		'attack'
			? 'side-attack'
			: 'side-defense'}"
	>
		<div class="relative size-16 overflow-hidden bg-(--side)/15">
			<img
				src={newest.portrait}
				alt=""
				class="absolute inset-0 size-full scale-[1.6] object-cover object-[50%_10%] transition group-hover:scale-[1.7]"
			/>
		</div>
		<div>
			<p class="label !text-[10px] !text-(--side)">
				New operator · {newest.season.code}
				{newest.season.name}
			</p>
			<p class="font-display text-3xl leading-none font-bold tracking-wide uppercase">
				{newest.name}
			</p>
			<p class="mt-0.5 font-mono text-[10px] tracking-widest text-muted uppercase">
				{newest.ability.name}
			</p>
		</div>
		<ArrowRight
			size={18}
			class="text-muted transition group-hover:translate-x-1 group-hover:text-fg"
		/>
	</a>
</section>

<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
	<div class="min-w-0">
		<FilterBar bind:filters roles={ROLES} squads={SQUADS} {counts} />

		{#if visible.length}
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<ul
				bind:this={grid}
				onkeydown={navigate}
				class="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6"
				aria-label="Operators — use arrow keys to move"
			>
				{#each visible as operator (operator.slug)}
					<li>
						<OperatorTile
							{operator}
							active={operator.slug === featured.slug}
							onpreview={(op) => (hoveredSlug = op.slug)}
							onselect={select}
						/>
					</li>
				{/each}
			</ul>
			<p class="mt-3 hidden font-mono text-[10px] tracking-widest text-muted/70 uppercase lg:block">
				// Tip: tab into the grid and use the arrow keys, Enter opens the dossier
			</p>
		{:else}
			<div class="hud mt-6 border border-line bg-surface/60 py-16 text-center">
				<p class="font-display text-2xl font-bold tracking-widest text-muted uppercase">
					No operators match
				</p>
				<button
					type="button"
					class="mt-3 font-mono text-xs tracking-widest text-attack uppercase hover:underline"
					onclick={() => (filters = emptyFilters())}>Reset filters</button
				>
			</div>
		{/if}
	</div>

	<div class="hidden lg:block">
		<div class="sticky top-20 h-[calc(100dvh-6rem)] max-h-[900px]">
			<OperatorPreview operator={featured} />
		</div>
	</div>
</div>

<PreviewSheet operator={sheetOperator} onclose={() => (sheetSlug = null)} />
