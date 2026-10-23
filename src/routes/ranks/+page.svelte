<script lang="ts">
	import { tiers } from '$lib/data/ranks';
	import RankEmblem from '$lib/components/RankEmblem.svelte';

	let selected = $state(tiers.length - 2);
	const tier = $derived(tiers[selected]);
	const ladder = [...tiers].reverse();
</script>

<svelte:head>
	<title>Ranks — R6 Intel</title>
	<meta
		name="description"
		content="Every Rainbow Six Siege ranked tier from Copper to Champion and the Legend division."
	/>
</svelte:head>

<p class="font-mono text-xs tracking-[0.3em] text-attack uppercase">// Ranked</p>
<h1 class="mt-1 font-display text-5xl leading-none font-bold tracking-wide uppercase sm:text-7xl">
	Rank <span class="text-outline [-webkit-text-stroke:1px_var(--color-fg)]">ladder</span>
</h1>
<p class="mt-3 max-w-2xl text-muted">
	{tiers.length} tiers. Most are split into five divisions, from V up to I. Win to earn Rank Points and
	climb, lose and you drop back down.
</p>

<div class="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
	<ol class="space-y-2" aria-label="Ranks from highest to lowest">
		{#each ladder as t (t.name)}
			{@const i = tiers.indexOf(t)}
			{@const active = i === selected}
			<li>
				<button
					type="button"
					aria-pressed={active}
					onclick={() => (selected = i)}
					onpointerenter={() => (selected = i)}
					class="group relative flex w-full items-center gap-4 overflow-hidden border px-4 py-3 text-left transition {active
						? 'bg-surface-2'
						: 'border-line bg-surface/60 hover:bg-surface'}"
					style="border-color: {active ? t.color : ''}"
				>
					<span
						class="absolute inset-y-0 left-0 w-1 transition-all group-hover:w-1.5"
						style="background: {t.color}; box-shadow: 0 0 16px {t.color}"
					></span>
					<span class="w-6 font-mono text-xs text-muted">{String(i + 1).padStart(2, '0')}</span>
					<RankEmblem color={t.color} size={44} label={t.divisions.length ? '' : t.name[0]} />
					<span
						class="font-display text-2xl font-bold tracking-widest uppercase"
						style="color: {t.color}">{t.name}</span
					>
					<span class="ml-auto hidden gap-1 sm:flex" aria-hidden="true">
						{#each t.divisions as d (d)}
							<span
								class="bg-white/5 px-2 py-0.5 font-display text-xs font-bold text-muted clip-tab"
								>{d}</span
							>
						{/each}
					</span>
				</button>
			</li>
		{/each}
	</ol>

	<aside
		class="hud sticky top-20 h-fit overflow-hidden border border-line bg-surface/80 p-6 backdrop-blur"
		style="--side: {tier.color}"
	>
		{#key tier.name}
			<div class="animate-rise">
				<div
					class="absolute inset-0 -z-10 opacity-30"
					style="background: radial-gradient(circle at 50% 0%, {tier.color}, transparent 60%)"
				></div>
				<div class="flex flex-col items-center text-center">
					<RankEmblem
						color={tier.color}
						size={140}
						label={tier.divisions.length ? 'I' : tier.name[0]}
					/>
					<p class="mt-4 label">Tier {selected + 1} of {tiers.length}</p>
					<h2
						class="font-display text-6xl leading-none font-bold tracking-widest uppercase"
						style="color: {tier.color}"
					>
						{tier.name}
					</h2>
					<p class="mt-3 text-sm text-muted">{tier.blurb}</p>
				</div>

				{#if tier.divisions.length}
					<div class="mt-6">
						<p class="mb-3 label">Divisions</p>
						<div class="grid grid-cols-5 gap-2">
							{#each tier.divisions as d (d)}
								<div class="flex flex-col items-center gap-1">
									<RankEmblem color={tier.color} size={48} label={d} />
									<span class="font-mono text-[10px] text-muted uppercase">{tier.name} {d}</span>
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<p
						class="mt-6 border-t border-line pt-4 text-center font-mono text-xs tracking-widest text-muted uppercase"
					>
						Single division · no sub-ranks
					</p>
				{/if}
			</div>
		{/key}
	</aside>
</div>
