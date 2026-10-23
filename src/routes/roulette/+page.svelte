<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowRight, Dices, Shuffle, Star } from '@lucide/svelte';
	import { operators, ROLES } from '$lib/data';
	import { roleLabel } from '$lib/filters';
	import { favorites } from '$lib/favorites.svelte';
	import { pick, randomLoadout, type RandomLoadout } from '$lib/random';
	import type { Operator, Side } from '$lib/types';
	import StatPips from '$lib/components/StatPips.svelte';

	let side = $state<Side>('attack');
	let role = $state<string | null>(null);
	let onlyFavorites = $state(false);
	let spinning = $state(false);
	// Raw state keeps operator objects comparable by identity.
	let current = $state.raw<Operator | null>(null);
	let result = $state.raw<Operator | null>(null);
	let loadout = $state.raw<RandomLoadout | null>(null);

	const pool = $derived(
		operators.filter(
			(op) =>
				op.side === side &&
				(!role || op.roles.includes(role)) &&
				(!onlyFavorites || favorites.has(op.slug))
		)
	);

	onMount(() => favorites.init());

	function spin() {
		if (spinning || !pool.length) return;
		const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const winner = pick(pool)!;
		result = null;
		loadout = null;
		spinning = true;

		// Flicker through random operators, slowing down before landing on the winner.
		let delay = 40;
		const step = () => {
			if (reduceMotion || delay > 320) {
				current = winner;
				result = winner;
				loadout = randomLoadout(winner);
				spinning = false;
				return;
			}
			current = pick(pool.length > 1 ? pool.filter((op) => op !== current) : pool)!;
			delay *= 1.15;
			setTimeout(step, delay);
		};
		step();
	}

	const slotClass = (on: boolean) =>
		`clip-tab px-4 py-1.5 text-xs font-semibold ${on ? 'bg-fg text-bg' : 'bg-surface-2 text-muted hover:text-fg'}`;
</script>

<svelte:head>
	<title>Operator Roulette — R6 Intel</title>
	<meta
		name="description"
		content="Can't decide? Spin for a random Rainbow Six Siege operator and loadout."
	/>
</svelte:head>

<div class="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
	<section class="space-y-6">
		<div>
			<p class="font-mono text-xs tracking-[0.3em] text-attack uppercase">// Can't decide?</p>
			<h1 class="mt-1 font-display text-6xl leading-none font-bold tracking-wide uppercase">
				Roulette
			</h1>
			<p class="mt-3 text-sm text-muted">
				Spin for a random operator and loadout. Narrow it down by role or stick to your favorites.
			</p>
		</div>

		<div class="grid grid-cols-2 gap-1">
			{#each ['attack', 'defense'] as const as s (s)}
				<button
					type="button"
					aria-pressed={side === s}
					onclick={() => {
						side = s;
						current = result = null;
					}}
					class="py-3 font-display text-lg font-bold tracking-widest uppercase transition clip-tab {side ===
					s
						? s === 'attack'
							? 'bg-attack text-black'
							: 'bg-defense text-black'
						: 'bg-surface-2 text-muted hover:text-fg'}"
				>
					{s === 'attack' ? 'Attack' : 'Defense'}
				</button>
			{/each}
		</div>

		<div>
			<p class="mb-2 label">Role</p>
			<div class="flex flex-wrap gap-1.5">
				<button
					type="button"
					aria-pressed={role === null}
					onclick={() => (role = null)}
					class={slotClass(role === null)}>Any</button
				>
				{#each ROLES as r (r)}
					<button
						type="button"
						aria-pressed={role === r}
						onclick={() => (role = r)}
						class={slotClass(role === r)}>{roleLabel(r)}</button
					>
				{/each}
			</div>
		</div>

		<label class="flex cursor-pointer items-center gap-2 text-sm text-muted">
			<input type="checkbox" bind:checked={onlyFavorites} class="accent-yellow-400" />
			<Star size={14} class="text-yellow-400" /> Favorites only
		</label>

		<button
			type="button"
			onclick={spin}
			disabled={spinning || !pool.length}
			class="flex w-full items-center justify-center gap-3 py-5 font-display text-2xl font-bold tracking-[0.2em] text-black uppercase transition clip-corner hover:brightness-110 disabled:opacity-50 {side ===
			'attack'
				? 'bg-attack'
				: 'bg-defense'}"
		>
			<Dices size={26} class={spinning ? 'animate-spin' : ''} />
			{spinning ? 'Rolling…' : result ? 'Spin again' : 'Spin'}
		</button>
		<p class="font-mono text-[11px] tracking-widest text-muted uppercase">
			// {pool.length} operator{pool.length === 1 ? '' : 's'} in the pool
		</p>
	</section>

	<section
		class="hud relative min-h-[520px] overflow-hidden border border-line bg-surface/60 {side ===
		'attack'
			? 'side-attack'
			: 'side-defense'}"
	>
		{#if current}
			<div class="grid h-full md:grid-cols-2">
				<div class="relative flex items-end">
					<div
						class="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,var(--side),transparent_60%)] transition-opacity duration-500 {result
							? 'opacity-50'
							: 'opacity-20'}"
					></div>
					<img
						src={current.portrait}
						alt="{current.name} portrait"
						class="relative w-full object-contain object-bottom {result
							? 'animate-rise'
							: 'opacity-70 blur-[1px]'}"
					/>
				</div>
				<div class="flex flex-col justify-center gap-5 p-6">
					<div class="flex items-center gap-3">
						<img src={current.badge} alt="" class="size-14" />
						<h2 class="font-display text-5xl leading-none font-bold tracking-wide uppercase">
							{current.name}
						</h2>
					</div>
					{#if result && loadout}
						<div class="animate-rise space-y-5">
							<div class="space-y-2">
								<StatPips label="Health" value={result.armor} size="lg" />
								<StatPips label="Speed" value={result.speed} size="lg" />
							</div>
							<div class="space-y-2">
								<p class="flex items-center gap-2 label"><Shuffle size={12} /> Your loadout</p>
								{#each [['Primary', loadout.primary], ['Secondary', loadout.secondary], ['Gadget', loadout.gadget]] as const as [label, item] (label)}
									{#if item}
										<div class="flex items-center justify-between gap-4 border-b border-line pb-2">
											<span class="font-mono text-[10px] tracking-widest text-muted uppercase"
												>{label}</span
											>
											<span class="font-display text-lg font-bold tracking-wide uppercase"
												>{item.name}</span
											>
										</div>
									{/if}
								{/each}
							</div>
							<a
								href="/operators/{result.slug}"
								class="inline-flex items-center gap-2 font-display text-sm font-bold tracking-widest text-(--side) uppercase hover:underline"
							>
								Open dossier <ArrowRight size={16} />
							</a>
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<div class="grid h-full min-h-[520px] place-items-center p-8 text-center">
				<div>
					<Dices size={56} class="mx-auto text-line" />
					<p class="mt-4 font-display text-2xl font-bold tracking-widest text-muted uppercase">
						{pool.length ? 'Hit spin' : 'Pool is empty'}
					</p>
					{#if !pool.length}
						<p class="mt-1 text-sm text-muted">Loosen the filters or add some favorites.</p>
					{/if}
				</div>
			</div>
		{/if}
	</section>
</div>
