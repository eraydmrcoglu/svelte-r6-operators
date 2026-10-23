<script lang="ts">
	import { Search, X } from '@lucide/svelte';
	import { applyFilters, emptyFilters } from '$lib/filters';
	import type { Operator, Side } from '$lib/types';

	let {
		open = $bindable(false),
		operators,
		side = null,
		exclude = [],
		title = 'Choose operator',
		onpick
	}: {
		open?: boolean;
		operators: Operator[];
		side?: Side | null;
		exclude?: string[];
		title?: string;
		onpick: (op: Operator) => void;
	} = $props();

	let dialog = $state<HTMLDialogElement>();
	let q = $state('');
	const list = $derived(
		applyFilters(operators, { ...emptyFilters(), q, side }).filter(
			(op) => !exclude.includes(op.slug)
		)
	);

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) {
			q = '';
			dialog.showModal();
		} else if (!open && dialog.open) dialog.close();
	});
</script>

<dialog
	bind:this={dialog}
	onclose={() => (open = false)}
	onclick={(e) => e.target === dialog && (open = false)}
	class="m-auto w-[min(920px,calc(100%-2rem))] border border-line bg-bg p-0 text-fg backdrop:bg-black/80 backdrop:backdrop-blur-sm"
>
	<div class="flex items-center gap-3 border-b border-line p-4">
		<h2 class="font-display text-2xl font-bold tracking-widest uppercase">{title}</h2>
		<button
			type="button"
			class="ml-auto grid size-9 place-items-center text-muted hover:text-fg"
			aria-label="Close"
			onclick={() => (open = false)}><X size={20} /></button
		>
	</div>
	<div class="p-4">
		<label class="relative block">
			<span class="sr-only">Search</span>
			<Search
				size={16}
				class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
			/>
			<!-- svelte-ignore a11y_autofocus -->
			<input
				type="search"
				bind:value={q}
				autofocus
				placeholder="Search"
				class="h-10 w-full border border-line bg-surface pr-3 pl-9 text-sm outline-none focus:border-muted"
			/>
		</label>
		<ul
			class="mt-4 grid max-h-[60vh] grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-6 md:grid-cols-8"
		>
			{#each list as op (op.slug)}
				<li>
					<button
						type="button"
						onclick={() => {
							onpick(op);
							open = false;
						}}
						class="group relative block aspect-square w-full overflow-hidden border border-line bg-surface transition hover:border-(--side) {op.side ===
						'attack'
							? 'side-attack'
							: 'side-defense'}"
					>
						<img
							src={op.portrait}
							alt=""
							loading="lazy"
							class="absolute inset-0 size-full scale-[1.35] object-cover object-[50%_8%] transition group-hover:scale-[1.45]"
						/>
						<span
							class="absolute inset-x-0 bottom-0 truncate bg-black/75 px-1 py-0.5 font-display text-xs font-bold tracking-wider uppercase"
							>{op.name}</span
						>
					</button>
				</li>
			{:else}
				<li class="col-span-full py-8 text-center text-sm text-muted">Nothing found</li>
			{/each}
		</ul>
	</div>
</dialog>
