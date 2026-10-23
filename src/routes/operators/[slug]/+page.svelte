<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowLeft, ChevronLeft, ChevronRight, Columns2 } from '@lucide/svelte';
	import { roleLabel } from '$lib/filters';
	import { favorites } from '$lib/favorites.svelte';
	import FavoriteButton from '$lib/components/FavoriteButton.svelte';
	import LoadoutItem from '$lib/components/LoadoutItem.svelte';
	import StatPips from '$lib/components/StatPips.svelte';

	let { data } = $props();
	const op = $derived(data.operator);

	onMount(() => favorites.init());

	const facts = $derived(
		[
			['Real name', op.realName],
			['Born', op.dateOfBirth],
			['Birthplace', op.placeOfBirth],
			['Squad', op.squad],
			['Released', `${op.season.code} · ${op.season.name}`]
		].filter((f): f is [string, string] => Boolean(f[1]))
	);

	const loadout = $derived([
		['Primary', op.primaries],
		['Secondary', op.secondaries],
		['Gadget', op.gadgets]
	] as const);
</script>

<svelte:head>
	<title
		>{op.name}: {op.side === 'attack' ? 'Attacker' : 'Defender'} Loadout &amp; Guide | R6 Intel</title
	>
	<meta
		name="description"
		content="{op.name}, {op.side} operator in Rainbow Six Siege. {op.ability.description.slice(
			0,
			140
		)}"
	/>
	<meta property="og:title" content="{op.name} | R6 Intel" />
	<meta property="og:image" content={op.portrait} />
</svelte:head>

<svelte:window
	onkeydown={(e) => {
		if (e.target instanceof HTMLInputElement) return;
		if (e.key === 'ArrowLeft') document.getElementById('prev-op')?.click();
		if (e.key === 'ArrowRight') document.getElementById('next-op')?.click();
	}}
/>

<article class={op.side === 'attack' ? 'side-attack' : 'side-defense'}>
	<nav
		class="flex items-center justify-between font-display text-sm font-bold tracking-widest uppercase"
	>
		<a href="/" class="flex items-center gap-2 text-muted hover:text-fg">
			<ArrowLeft size={16} /> Operators
		</a>
		<div class="flex gap-1">
			<a
				id="prev-op"
				href="/operators/{data.prev.slug}"
				class="flex items-center gap-1 bg-surface-2 px-4 py-2 text-muted clip-tab hover:text-fg"
				aria-label="Previous: {data.prev.name}"
			>
				<ChevronLeft size={16} /><span class="hidden sm:inline">{data.prev.name}</span>
			</a>
			<a
				id="next-op"
				href="/operators/{data.next.slug}"
				class="flex items-center gap-1 bg-surface-2 px-4 py-2 text-muted clip-tab hover:text-fg"
				aria-label="Next: {data.next.name}"
			>
				<span class="hidden sm:inline">{data.next.name}</span><ChevronRight size={16} />
			</a>
		</div>
	</nav>

	<header class="relative mt-4 grid items-end gap-6 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
		<span
			class="pointer-events-none absolute top-0 left-0 -z-0 font-display text-[clamp(5rem,16vw,15rem)] leading-[0.8] font-bold whitespace-nowrap text-outline uppercase select-none"
			aria-hidden="true">{op.name}</span
		>
		<div class="relative aspect-[720/616]">
			<div
				class="absolute inset-x-0 bottom-0 h-3/4 bg-[radial-gradient(ellipse_at_50%_100%,var(--side),transparent_65%)] opacity-50"
			></div>
			<img
				src={op.portrait}
				alt="{op.name} portrait"
				class="relative size-full object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
				style="view-transition-name: portrait-{op.slug}"
			/>
			<div class="absolute inset-x-0 bottom-0 h-px bg-(--side) shadow-[0_0_20px_var(--side)]"></div>
		</div>

		<div
			class="hud relative animate-rise space-y-6 border border-line bg-surface/80 p-6 backdrop-blur"
		>
			<div class="flex items-start gap-4">
				<img src={op.badge} alt="" class="size-16" />
				<div class="min-w-0 flex-1">
					<p class="label !text-(--side)">
						{op.side === 'attack' ? 'Attacker' : 'Defender'} · {op.season.code}
					</p>
					<h1
						class="font-display text-5xl leading-none font-bold tracking-wide uppercase sm:text-6xl"
					>
						{op.name}
					</h1>
				</div>
				<FavoriteButton slug={op.slug} name={op.name} class="size-10 border border-line" />
			</div>

			<div class="flex flex-wrap gap-1.5">
				{#each op.roles as role (role)}
					<a
						href="/?roles={role}"
						class="bg-surface-2 px-4 py-1 text-xs font-semibold text-muted clip-tab hover:text-fg"
						>{roleLabel(role)}</a
					>
				{/each}
			</div>

			<div class="space-y-2.5">
				<StatPips label="Health" value={op.armor} size="lg" />
				<StatPips label="Speed" value={op.speed} size="lg" />
				<StatPips label="Difficulty" value={op.difficulty} size="lg" />
			</div>

			<dl class="grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-5 text-sm">
				{#each facts as [label, value] (label)}
					<div>
						<dt class="label !text-[10px]">{label}</dt>
						<dd class="mt-0.5">{value}</dd>
					</div>
				{/each}
			</dl>

			<a
				href="/compare?ops={op.slug}"
				class="flex items-center gap-2 font-display text-sm font-bold tracking-widest text-muted uppercase hover:text-fg"
			>
				<Columns2 size={16} /> Compare with…
			</a>
		</div>
	</header>

	{#if op.ability.name || op.ability.description}
		<section
			class="relative mt-10 overflow-hidden bg-linear-to-r from-(--side)/25 to-surface p-6 clip-corner sm:p-8"
		>
			{#if op.ability.remoteImage}
				<img
					src="/operators/{op.slug}/ability.webp"
					alt=""
					class="pointer-events-none absolute top-1/2 right-8 hidden w-60 -translate-y-1/2 opacity-25 md:block"
				/>
			{/if}
			<p class="label !text-(--side)">Unique ability</p>
			{#if op.ability.name}
				<h2 class="mt-1 font-display text-4xl font-bold tracking-wide uppercase">
					{op.ability.name}
				</h2>
			{/if}
			<p class="relative mt-3 max-w-2xl leading-relaxed text-fg/75">{op.ability.description}</p>
		</section>
	{/if}

	<section class="mt-12">
		<h2 class="font-display text-3xl font-bold tracking-widest uppercase">
			<span class="text-(--side)">//</span> Loadout
		</h2>
		<div class="mt-4 grid gap-6 md:grid-cols-3">
			{#each loadout as [label, items] (label)}
				{#if items.length}
					<div>
						<h3 class="mb-2 label">{label}</h3>
						<ul class="space-y-2">
							{#each items as item (item.slug)}<LoadoutItem {item} />{/each}
						</ul>
					</div>
				{/if}
			{/each}
		</div>
	</section>

	{#if op.biography.length}
		<section class="mt-14 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
			<h2 class="font-display text-3xl font-bold tracking-widest uppercase">
				<span class="text-(--side)">//</span> Dossier
			</h2>
			<div class="max-w-3xl space-y-10">
				{#each op.biography as section (section.title)}
					<div>
						<h3 class="label !text-(--side)">{section.title}</h3>
						<div class="mt-3 space-y-4 leading-relaxed text-fg/70">
							{#each section.paragraphs as paragraph, i (i)}<p>{paragraph}</p>{/each}
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</article>
