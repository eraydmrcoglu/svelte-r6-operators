<script lang="ts">
	import { Search, SlidersHorizontal, Star, X } from '@lucide/svelte';
	import { activeFilterCount, emptyFilters, roleLabel, type Filters } from '$lib/filters';
	import { seasons } from '$lib/data/meta';
	import type { Side } from '$lib/types';

	let {
		filters = $bindable(),
		roles,
		squads,
		counts
	}: {
		filters: Filters;
		roles: string[];
		squads: string[];
		counts: { all: number; attack: number; defense: number; shown: number };
	} = $props();

	let open = $state(false);
	const years = [...new Set(seasons.map((s) => s.year))];
	const advanced = $derived(activeFilterCount(filters) - (filters.side ? 1 : 0));

	const tabs: { value: Side | null; label: string; count: () => number }[] = [
		{ value: null, label: 'All', count: () => counts.all },
		{ value: 'attack', label: 'Attackers', count: () => counts.attack },
		{ value: 'defense', label: 'Defenders', count: () => counts.defense }
	];

	function toggleRole(role: string) {
		filters.roles = filters.roles.includes(role)
			? filters.roles.filter((r) => r !== role)
			: [...filters.roles, role];
	}

	const selectClass =
		'h-10 border border-line bg-surface px-3 font-display text-sm font-semibold tracking-wider uppercase text-fg outline-none focus:border-muted';
</script>

<div class="space-y-3">
	<div class="flex flex-wrap items-end gap-x-6 gap-y-3 border-b border-line">
		{#each tabs as tab (tab.label)}
			{@const selected = filters.side === tab.value}
			<button
				type="button"
				aria-pressed={selected}
				onclick={() => (filters.side = tab.value)}
				class="relative -mb-px flex items-baseline gap-2 pb-3 font-display text-xl font-bold tracking-widest uppercase transition sm:text-2xl
					{tab.value === 'attack' ? 'side-attack' : tab.value === 'defense' ? 'side-defense' : ''}
					{selected ? 'text-fg' : 'text-muted hover:text-fg'}"
			>
				{tab.label}
				<span class="font-mono text-xs text-muted">{tab.count()}</span>
				{#if selected}
					<span
						class="absolute inset-x-0 bottom-0 h-0.5 bg-(--side,var(--color-fg)) shadow-[0_0_12px_var(--side,white)]"
					></span>
				{/if}
			</button>
		{/each}
	</div>

	<div class="flex flex-wrap items-center gap-2">
		<label class="relative min-w-56 flex-1">
			<span class="sr-only">Search operators</span>
			<Search
				size={16}
				class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
			/>
			<input
				type="search"
				bind:value={filters.q}
				placeholder="Operator, gadget or weapon"
				class="h-10 w-full border border-line bg-surface pr-3 pl-9 text-sm outline-none placeholder:text-muted focus:border-muted"
			/>
		</label>

		<button
			type="button"
			aria-pressed={filters.favorites}
			onclick={() => (filters.favorites = !filters.favorites)}
			class="flex h-10 items-center gap-2 border px-3 font-display text-sm font-semibold tracking-wider uppercase transition {filters.favorites
				? 'border-yellow-400/60 text-yellow-400'
				: 'border-line text-muted hover:text-fg'}"
		>
			<Star size={15} fill={filters.favorites ? 'currentColor' : 'none'} /> Favorites
		</button>

		<select bind:value={filters.sort} class={selectClass} aria-label="Sort">
			<option value="name">A–Z</option>
			<option value="newest">Newest</option>
			<option value="oldest">Oldest</option>
		</select>

		<button
			type="button"
			onclick={() => (open = !open)}
			aria-expanded={open}
			class="flex h-10 items-center gap-2 border border-line px-3 font-display text-sm font-semibold tracking-wider uppercase hover:text-fg {open
				? 'text-fg'
				: 'text-muted'}"
		>
			<SlidersHorizontal size={15} /> Filters
			{#if advanced}<span class="bg-attack px-1.5 font-mono text-xs text-black">{advanced}</span
				>{/if}
		</button>
	</div>

	{#if open}
		<div class="hud space-y-4 border border-line bg-surface/80 p-4 backdrop-blur">
			<div>
				<p class="mb-2 label">Role</p>
				<div class="flex flex-wrap gap-1.5">
					{#each roles as role (role)}
						{@const on = filters.roles.includes(role)}
						<button
							type="button"
							aria-pressed={on}
							onclick={() => toggleRole(role)}
							class="px-4 py-1.5 text-xs font-semibold transition clip-tab {on
								? 'bg-fg text-bg'
								: 'bg-surface-2 text-muted hover:text-fg'}"
						>
							{roleLabel(role)}
						</button>
					{/each}
				</div>
			</div>
			<div class="flex flex-wrap gap-2">
				<select bind:value={filters.armor} class={selectClass} aria-label="Health">
					<option value={null}>Any health</option>
					{#each [1, 2, 3] as n (n)}<option value={n}>Health {n}</option>{/each}
				</select>
				<select bind:value={filters.speed} class={selectClass} aria-label="Speed">
					<option value={null}>Any speed</option>
					{#each [1, 2, 3] as n (n)}<option value={n}>Speed {n}</option>{/each}
				</select>
				<select bind:value={filters.squad} class={selectClass} aria-label="Squad">
					<option value={null}>Any squad</option>
					{#each squads as squad (squad)}<option value={squad}>{squad}</option>{/each}
				</select>
				<select bind:value={filters.year} class={selectClass} aria-label="Release year">
					<option value={null}>Any year</option>
					{#each years as year (year)}
						<option value={year}>{year === 0 ? 'Launch' : `Year ${year}`}</option>
					{/each}
				</select>
				{#if activeFilterCount(filters) || filters.q}
					<button
						type="button"
						onclick={() => (filters = { ...emptyFilters(), sort: filters.sort })}
						class="flex h-10 items-center gap-1 px-3 font-display text-sm font-semibold tracking-wider text-muted uppercase hover:text-fg"
					>
						<X size={14} /> Reset
					</button>
				{/if}
			</div>
		</div>
	{/if}

	<p class="font-mono text-[11px] tracking-widest text-muted uppercase" aria-live="polite">
		// {counts.shown} operator{counts.shown === 1 ? '' : 's'}
	</p>
</div>
