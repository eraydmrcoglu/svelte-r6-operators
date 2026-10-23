<script lang="ts">
	import { ArrowLeft, ChevronLeft, ChevronRight, Download } from '@lucide/svelte';
	import { PLAYLISTS } from '$lib/data/maps';

	let { data } = $props();
	const map = $derived(data.map);

	const facts = $derived(
		[
			['Location', map.location],
			['Released', map.released],
			['Reworked', map.reworked]
		].filter((f): f is [string, string] => Boolean(f[1]))
	);
</script>

<svelte:head>
	<title>{map.name} — Maps — R6 Intel</title>
	<meta name="description" content={map.description.slice(0, 160)} />
	<meta property="og:image" content={map.hero} />
</svelte:head>

<nav
	class="flex items-center justify-between font-display text-sm font-bold tracking-widest uppercase"
>
	<a href="/maps" class="flex items-center gap-2 text-muted hover:text-fg">
		<ArrowLeft size={16} /> Maps
	</a>
	<div class="flex gap-1">
		<a
			href="/maps/{data.prev.slug}"
			class="flex items-center gap-1 bg-surface-2 px-4 py-2 text-muted clip-tab hover:text-fg"
			aria-label="Previous: {data.prev.name}"
		>
			<ChevronLeft size={16} /><span class="hidden sm:inline">{data.prev.name}</span>
		</a>
		<a
			href="/maps/{data.next.slug}"
			class="flex items-center gap-1 bg-surface-2 px-4 py-2 text-muted clip-tab hover:text-fg"
			aria-label="Next: {data.next.name}"
		>
			<span class="hidden sm:inline">{data.next.name}</span><ChevronRight size={16} />
		</a>
	</div>
</nav>

<header class="relative mt-4 aspect-[21/9] min-h-72 overflow-hidden border border-line">
	<img
		src={map.hero}
		alt="{map.name} key art"
		class="absolute inset-0 size-full object-cover"
		style="view-transition-name: map-{map.slug}"
	/>
	<div class="absolute inset-0 bg-linear-to-t from-bg via-bg/40 to-transparent"></div>
	<div class="absolute inset-x-0 bottom-0 p-6 sm:p-10">
		<p class="font-mono text-xs tracking-[0.3em] text-attack uppercase">// {map.location}</p>
		<h1 class="font-display text-6xl leading-none font-bold tracking-wide uppercase sm:text-8xl">
			{map.name}
		</h1>
	</div>
</header>

<div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
	<section>
		<h2 class="font-display text-3xl font-bold tracking-widest uppercase">
			<span class="text-attack">//</span> Briefing
		</h2>
		<p class="mt-4 max-w-3xl leading-relaxed text-fg/75">{map.description}</p>
	</section>

	<aside class="hud space-y-5 border border-line bg-surface/80 p-6">
		<dl class="space-y-3 text-sm">
			{#each facts as [label, value] (label)}
				<div>
					<dt class="label !text-[10px]">{label}</dt>
					<dd class="mt-0.5">{value}</dd>
				</div>
			{/each}
		</dl>
		<div>
			<p class="label !text-[10px]">Playlists</p>
			<div class="mt-2 flex flex-wrap gap-1.5">
				{#each map.playlists as p (p)}
					<a
						href="/maps"
						class="px-4 py-1 text-xs font-semibold clip-tab {p === 'ranked'
							? 'bg-attack text-black'
							: 'bg-surface-2 text-muted'}">{PLAYLISTS[p] ?? p}</a
					>
				{/each}
			</div>
		</div>
		{#if map.blueprints}
			<a
				href={map.blueprints}
				rel="noopener"
				class="flex items-center justify-between bg-attack px-5 py-3 font-display text-lg font-bold tracking-widest text-black uppercase clip-corner hover:brightness-110"
			>
				Blueprints (.zip) <Download size={18} />
			</a>
			<p class="text-xs text-muted">Official floor plans, hosted by Ubisoft.</p>
		{/if}
	</aside>
</div>
