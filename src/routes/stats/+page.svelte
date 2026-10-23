<script lang="ts">
	import { ExternalLink, Search } from '@lucide/svelte';
	import { operators } from '$lib/data';
	import { maps } from '$lib/data/maps';
	import { seasons } from '$lib/data/meta';
	import { roleLabel } from '$lib/filters';
	import { countBy, PLATFORMS, trackerUrl, type Platform } from '$lib/stats';

	let platform = $state<Platform>('ubi');
	let username = $state('');

	function lookup(e: SubmitEvent) {
		e.preventDefault();
		if (username.trim()) window.open(trackerUrl(platform, username), '_blank', 'noopener');
	}

	const sideCounts = countBy(operators, (op) => op.side);
	const roleCounts = countBy(operators, (op) => op.roles);
	const weaponTypes = countBy(operators, (op) =>
		op.primaries.flatMap((w) => (w.type ? [w.type] : []))
	);
	const perYear = seasons
		.map((s) => s.year)
		.filter((y, i, all) => all.indexOf(y) === i)
		.map((year) => ({
			year,
			attack: operators.filter((o) => o.season.year === year && o.side === 'attack').length,
			defense: operators.filter((o) => o.season.year === year && o.side === 'defense').length
		}));
	const maxYear = Math.max(...perYear.map((y) => y.attack + y.defense));
	const statGrid = [1, 2, 3].map((speed) =>
		[3, 2, 1].map((armor) => ({
			armor,
			speed,
			ops: operators.filter((o) => o.armor === armor && o.speed === speed)
		}))
	);
	const newest = [...operators].sort((a, b) => b.season.order - a.season.order).slice(0, 4);
	const ranked = maps.filter((m) => m.playlists.includes('ranked')).length;
</script>

<svelte:head>
	<title>Player Stats Lookup | R6 Intel</title>
	<meta
		name="description"
		content="Look up Rainbow Six Siege player stats and explore the operator roster in numbers."
	/>
</svelte:head>

<p class="font-mono text-xs tracking-[0.3em] text-attack uppercase">// Intel</p>
<h1 class="mt-1 font-display text-5xl leading-none font-bold tracking-wide uppercase sm:text-7xl">
	Stats
</h1>

<form
	onsubmit={lookup}
	class="hud mt-8 grid gap-3 border border-line bg-surface/80 p-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-end"
>
	<div>
		<p class="mb-2 label">Platform</p>
		<div class="flex gap-1">
			{#each PLATFORMS as p (p.value)}
				<button
					type="button"
					aria-pressed={platform === p.value}
					onclick={() => (platform = p.value)}
					class="px-4 py-2.5 font-display text-sm font-bold tracking-wider whitespace-nowrap uppercase clip-tab {platform ===
					p.value
						? 'bg-fg text-bg'
						: 'bg-surface-2 text-muted hover:text-fg'}">{p.label}</button
				>
			{/each}
		</div>
	</div>
	<label class="block">
		<span class="mb-2 block label">Player name</span>
		<input
			bind:value={username}
			required
			autocomplete="off"
			spellcheck="false"
			placeholder="Ubisoft, PSN or Xbox name"
			class="h-11 w-full border border-line bg-bg px-3 font-mono text-sm outline-none placeholder:text-muted focus:border-attack"
		/>
	</label>
	<button
		type="submit"
		class="flex h-11 items-center justify-center gap-2 bg-attack px-6 font-display font-bold tracking-widest text-black uppercase clip-corner hover:brightness-110"
	>
		<Search size={16} /> Look up <ExternalLink size={14} />
	</button>
	<p class="text-xs text-muted sm:col-span-3">
		Opens the player's rank, K/D and match history on R6 Tracker in a new tab.
	</p>
</form>

<section class="mt-12">
	<h2 class="font-display text-3xl font-bold tracking-widest uppercase">
		<span class="text-attack">//</span> Roster in numbers
	</h2>

	<dl class="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
		{#each [['Operators', operators.length], ['Attackers', sideCounts.find(([s]) => s === 'attack')?.[1] ?? 0], ['Defenders', sideCounts.find(([s]) => s === 'defense')?.[1] ?? 0], ['Ranked maps', ranked]] as [label, value] (label)}
			<div class="border border-line bg-surface/70 p-4">
				<dt class="label !text-[10px]">{label}</dt>
				<dd class="mt-1 font-display text-5xl leading-none font-bold">{value}</dd>
			</div>
		{/each}
	</dl>

	<div class="mt-6 grid gap-6 lg:grid-cols-2">
		<div class="border border-line bg-surface/70 p-5">
			<h3 class="label">Operators added per year</h3>
			<div class="mt-4 flex h-48 items-end gap-1.5">
				{#each perYear as y (y.year)}
					<div
						class="group flex h-full flex-1 flex-col justify-end"
						title="{y.year === 0
							? 'Launch'
							: `Year ${y.year}`}: {y.attack} attack, {y.defense} defense"
					>
						<div
							class="bg-defense/80 transition group-hover:bg-defense"
							style="height: {(y.defense / maxYear) * 100}%"
						></div>
						<div
							class="bg-attack/80 transition group-hover:bg-attack"
							style="height: {(y.attack / maxYear) * 100}%"
						></div>
						<span class="mt-1 text-center font-mono text-[10px] text-muted"
							>{y.year === 0 ? 'L' : y.year}</span
						>
					</div>
				{/each}
			</div>
			<p class="mt-3 flex gap-4 font-mono text-[10px] tracking-widest text-muted uppercase">
				<span class="flex items-center gap-1.5"><span class="size-2 bg-attack"></span>Attack</span>
				<span class="flex items-center gap-1.5"><span class="size-2 bg-defense"></span>Defense</span
				>
			</p>
		</div>

		<div class="border border-line bg-surface/70 p-5">
			<h3 class="label">Health × speed</h3>
			<div class="mt-4 grid grid-cols-[auto_repeat(3,minmax(0,1fr))] gap-1.5 text-center">
				<span></span>
				{#each [3, 2, 1] as a (a)}<span class="font-mono text-[10px] text-muted uppercase"
						>Health {a}</span
					>{/each}
				{#each statGrid as row, i (i)}
					<span class="self-center pr-2 font-mono text-[10px] text-muted uppercase"
						>Speed {i + 1}</span
					>
					{#each row as cell (cell.armor)}
						<a
							href="/?health={cell.armor}&speed={cell.speed}"
							class="grid h-14 place-items-center border border-line font-display text-2xl font-bold transition hover:border-attack"
							style="background: color-mix(in oklab, var(--color-attack) {(cell.ops.length /
								operators.length) *
								220}%, transparent)"
							title={cell.ops.map((o) => o.name).join(', ')}>{cell.ops.length || '·'}</a
						>
					{/each}
				{/each}
			</div>
			<p class="mt-3 text-xs text-muted">Click a cell to see those operators.</p>
		</div>

		<div class="border border-line bg-surface/70 p-5">
			<h3 class="label">Roles</h3>
			<ul class="mt-4 space-y-2">
				{#each roleCounts as [role, n] (role)}
					<li>
						<a
							href="/?roles={role}"
							class="group grid grid-cols-[120px_minmax(0,1fr)_32px] items-center gap-3 text-sm"
						>
							<span class="text-muted group-hover:text-fg">{roleLabel(role)}</span>
							<span class="h-2 bg-surface-2"
								><span
									class="block h-full bg-attack/80 group-hover:bg-attack"
									style="width: {(n / roleCounts[0][1]) * 100}%"
								></span></span
							>
							<span class="text-right font-mono text-xs">{n}</span>
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<div class="border border-line bg-surface/70 p-5">
			<h3 class="label">Primary weapon types</h3>
			<ul class="mt-4 space-y-2">
				{#each weaponTypes as [type, n] (type)}
					<li class="grid grid-cols-[140px_minmax(0,1fr)_32px] items-center gap-3 text-sm">
						<span class="text-muted capitalize">{type}</span>
						<span class="h-2 bg-surface-2"
							><span
								class="block h-full bg-defense/80"
								style="width: {(n / weaponTypes[0][1]) * 100}%"
							></span></span
						>
						<span class="text-right font-mono text-xs">{n}</span>
					</li>
				{/each}
			</ul>
			<p class="mt-3 text-xs text-muted">Counts how many operators can pick each type.</p>
		</div>
	</div>

	<div class="mt-6">
		<h3 class="label">Newest operators</h3>
		<ul class="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
			{#each newest as op (op.slug)}
				<li>
					<a
						href="/operators/{op.slug}"
						class="flex items-center gap-3 border border-line bg-surface/70 p-3 hover:border-attack/60"
					>
						<img src={op.badge} alt="" class="size-10" />
						<span>
							<span class="block font-display text-xl leading-none font-bold uppercase"
								>{op.name}</span
							>
							<span class="font-mono text-[10px] text-muted uppercase"
								>{op.season.code} · {op.season.name}</span
							>
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>
