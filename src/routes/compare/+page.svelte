<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { Plus, X } from '@lucide/svelte';
	import { getOperator, operators } from '$lib/data';
	import { roleLabel } from '$lib/filters';
	import { parseSlugList } from '$lib/slug-list';
	import type { Operator } from '$lib/types';
	import OperatorPicker from '$lib/components/OperatorPicker.svelte';
	import StatPips from '$lib/components/StatPips.svelte';

	const SLOTS = 3;
	let slots = $state<(string | null)[]>(Array(SLOTS).fill(null));
	let picking = $state<number | null>(null);
	let pickerOpen = $state(false);
	let ready = $state(false);

	const chosen = $derived(slots.map((s) => (s ? getOperator(s)! : null)));

	onMount(() => {
		const ops = new URLSearchParams(location.search).get('ops');
		slots = parseSlugList(ops, SLOTS, (s) => !!getOperator(s));
		ready = true;
	});

	$effect(() => {
		const ops = slots.filter(Boolean).join(',');
		if (!untrack(() => ready)) return;
		replaceState(ops ? `?ops=${ops}` : location.pathname, {});
	});

	function openPicker(i: number) {
		picking = i;
		pickerOpen = true;
	}

	const sideClass = (op: Operator | null) =>
		op ? (op.side === 'attack' ? 'side-attack' : 'side-defense') : '';

	// Rows of the comparison table: label + how to read each operator's value.
	type Row =
		| { label: string; kind: 'stat'; get: (op: Operator) => number }
		| { label: string; kind: 'list'; get: (op: Operator) => string[] }
		| { label: string; kind: 'text'; get: (op: Operator) => string };
	const rows: Row[] = [
		{ label: 'Health', kind: 'stat', get: (op) => op.armor },
		{ label: 'Speed', kind: 'stat', get: (op) => op.speed },
		{ label: 'Difficulty', kind: 'stat', get: (op) => op.difficulty },
		{ label: 'Roles', kind: 'list', get: (op) => op.roles.map(roleLabel) },
		{ label: 'Unique ability', kind: 'text', get: (op) => op.ability.name ?? '—' },
		{ label: 'Primary', kind: 'list', get: (op) => op.primaries.map((w) => w.name) },
		{ label: 'Secondary', kind: 'list', get: (op) => op.secondaries.map((w) => w.name) },
		{ label: 'Gadget', kind: 'list', get: (op) => op.gadgets.map((w) => w.name) },
		{ label: 'Squad', kind: 'text', get: (op) => op.squad ?? '—' },
		{ label: 'Released', kind: 'text', get: (op) => `${op.season.code} · ${op.season.name}` }
	];

	// A list item is highlighted when none of the other compared operators have it.
	function exclusive(get: (op: Operator) => string[], op: Operator, value: string) {
		const others = chosen.filter((o): o is Operator => !!o && o !== op);
		return others.length > 0 && others.every((o) => !get(o).includes(value));
	}
</script>

<svelte:head>
	<title>Compare operators — R6 Intel</title>
</svelte:head>

<p class="font-mono text-xs tracking-[0.3em] text-attack uppercase">// Side by side</p>
<h1 class="mt-1 font-display text-6xl leading-none font-bold tracking-wide uppercase">Compare</h1>

<div class="mt-8 overflow-x-auto">
	<div class="grid min-w-[720px] grid-cols-[140px_repeat(3,minmax(0,1fr))] gap-x-3">
		<div></div>
		{#each chosen as op, i (i)}
			<div class="pb-4 {sideClass(op)}">
				{#if op}
					<div class="hud relative overflow-hidden border border-line bg-surface">
						<div
							class="absolute inset-0 bg-[radial-gradient(circle_at_50%_90%,var(--side),transparent_60%)] opacity-40"
						></div>
						<img
							src={op.portrait}
							alt="{op.name} portrait"
							class="relative aspect-[720/616] w-full object-contain object-bottom"
						/>
						<button
							type="button"
							class="absolute top-2 right-2 grid size-8 place-items-center bg-black/60 text-muted hover:text-fg"
							aria-label="Remove {op.name}"
							onclick={() => (slots[i] = null)}><X size={16} /></button
						>
						<div class="relative flex items-center gap-2 border-t border-line bg-surface px-3 py-2">
							<img src={op.badge} alt="" class="size-8" />
							<a
								href="/operators/{op.slug}"
								class="truncate font-display text-2xl font-bold tracking-wide uppercase hover:text-(--side)"
								>{op.name}</a
							>
							<button
								type="button"
								class="ml-auto font-mono text-[10px] tracking-widest text-muted uppercase hover:text-fg"
								onclick={() => openPicker(i)}>Swap</button
							>
						</div>
					</div>
				{:else}
					<button
						type="button"
						onclick={() => openPicker(i)}
						class="grid aspect-[720/680] w-full place-items-center border border-dashed border-line bg-surface/40 text-muted transition hover:border-muted hover:text-fg"
					>
						<span
							class="flex flex-col items-center gap-2 font-display text-lg font-bold tracking-widest uppercase"
						>
							<Plus size={28} /> Add operator
						</span>
					</button>
				{/if}
			</div>
		{/each}

		{#each rows as row (row.label)}
			<div class="flex items-center border-t border-line py-3 label">{row.label}</div>
			{#each chosen as op, i (i)}
				<div class="border-t border-line py-3 {sideClass(op)}">
					{#if op}
						{#if row.kind === 'stat'}
							<StatPips label="" value={row.get(op)} size="lg" />
						{:else if row.kind === 'list'}
							<div class="flex flex-wrap gap-1">
								{#each row.get(op) as v (v)}
									<span
										class="px-2 py-0.5 text-xs {exclusive(row.get, op, v)
											? 'bg-(--side)/20 text-fg'
											: 'bg-surface-2 text-muted'}">{v}</span
									>
								{/each}
							</div>
						{:else}
							<span class="text-sm">{row.get(op)}</span>
						{/if}
					{/if}
				</div>
			{/each}
		{/each}
	</div>
</div>
<p class="mt-4 font-mono text-[11px] tracking-widest text-muted uppercase">
	// Highlighted items are exclusive to that operator in this comparison
</p>

<OperatorPicker
	bind:open={pickerOpen}
	{operators}
	exclude={slots.filter((s): s is string => !!s)}
	onpick={(op) => {
		if (picking !== null) slots[picking] = op.slug;
	}}
/>
