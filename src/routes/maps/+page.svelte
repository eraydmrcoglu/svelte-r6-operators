<script lang="ts">
	import { Search } from '@lucide/svelte';
	import { maps, PLAYLISTS } from '$lib/data/maps';

	let q = $state('');
	let playlist = $state<string | null>(null);

	const visible = $derived(
		maps.filter(
			(m) =>
				(!playlist || m.playlists.includes(playlist)) &&
				`${m.name} ${m.location ?? ''}`.toLowerCase().includes(q.trim().toLowerCase())
		)
	);
	const tabs = [null, 'ranked', 'quickmatch', 'unranked', 'teamdeathmatch'];
	const count = (p: string | null) => maps.filter((m) => !p || m.playlists.includes(p)).length;
</script>

<svelte:head>
	<title>All Siege Maps &amp; Blueprints | R6 Intel</title>
	<meta
		name="description"
		content="All {maps.length} Rainbow Six Siege maps with locations, playlists and official blueprints."
	/>
</svelte:head>

<p class="font-mono text-xs tracking-[0.3em] text-attack uppercase">// {maps.length} locations</p>
<h1 class="mt-1 font-display text-5xl leading-none font-bold tracking-wide uppercase sm:text-7xl">
	Select <span class="text-outline [-webkit-text-stroke:1px_var(--color-fg)]">map</span>
</h1>

<div class="mt-6 flex flex-wrap items-end gap-x-6 gap-y-3 border-b border-line">
	{#each tabs as tab (tab)}
		{@const selected = playlist === tab}
		<button
			type="button"
			aria-pressed={selected}
			onclick={() => (playlist = tab)}
			class="relative -mb-px flex items-baseline gap-2 pb-3 font-display text-lg font-bold tracking-widest uppercase transition sm:text-xl {selected
				? 'text-fg'
				: 'text-muted hover:text-fg'}"
		>
			{tab ? PLAYLISTS[tab] : 'All'}
			<span class="font-mono text-xs text-muted">{count(tab)}</span>
			{#if selected}
				<span
					class="absolute inset-x-0 bottom-0 h-0.5 bg-attack shadow-[0_0_12px_var(--color-attack)]"
				></span>
			{/if}
		</button>
	{/each}
</div>

<label class="relative mt-4 block max-w-sm">
	<span class="sr-only">Search maps</span>
	<Search
		size={16}
		class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
	/>
	<input
		type="search"
		bind:value={q}
		placeholder="Map or location"
		class="h-10 w-full border border-line bg-surface pr-3 pl-9 text-sm outline-none placeholder:text-muted focus:border-muted"
	/>
</label>

<ul class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#each visible as map (map.slug)}
		<li>
			<a
				href="/maps/{map.slug}"
				onclick={(e) => {
					// Name only the clicked thumbnail so it alone morphs into the map header.
					const img = e.currentTarget.querySelector('img');
					if (img) img.style.viewTransitionName = `map-${map.slug}`;
				}}
				class="group relative block aspect-video overflow-hidden border border-line bg-surface transition hover:border-attack/70"
			>
				<img
					src={map.thumbnail}
					alt=""
					loading="lazy"
					class="size-full object-cover transition duration-500 group-hover:scale-105"
				/>
				<div class="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent"></div>
				<div class="absolute inset-x-0 bottom-0 p-4">
					<p class="font-mono text-[10px] tracking-widest text-white/60 uppercase">
						{map.location}
					</p>
					<h2 class="font-display text-2xl leading-tight font-bold tracking-wide uppercase">
						{map.name}
					</h2>
				</div>
				{#if map.playlists.includes('ranked')}
					<span
						class="absolute top-3 right-3 bg-attack px-3 py-0.5 font-display text-xs font-bold tracking-widest text-black uppercase clip-tab"
						>Ranked</span
					>
				{/if}
				<span
					class="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-attack transition-transform duration-300 group-hover:scale-x-100"
				></span>
			</a>
		</li>
	{:else}
		<li class="col-span-full py-16 text-center font-display text-2xl text-muted uppercase">
			No maps match
		</li>
	{/each}
</ul>
