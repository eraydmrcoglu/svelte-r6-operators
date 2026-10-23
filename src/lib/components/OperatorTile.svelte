<script lang="ts">
	import type { Operator } from '$lib/types';
	import FavoriteButton from './FavoriteButton.svelte';

	let {
		operator,
		active = false,
		onpreview,
		onselect
	}: {
		operator: Operator;
		active?: boolean;
		onpreview?: (op: Operator) => void;
		/** Called before navigating; call preventDefault on the event to stay on the page. */
		onselect?: (op: Operator, event: MouseEvent) => void;
	} = $props();

	let portrait = $state<HTMLImageElement>();

	function select(event: MouseEvent) {
		onselect?.(operator, event);
		// Only the clicked tile morphs into the detail page. Naming every tile made all
		// portraits animate whenever the grid page itself was re-entered.
		if (!event.defaultPrevented && portrait)
			portrait.style.viewTransitionName = `portrait-${operator.slug}`;
	}
</script>

<div class="group relative {operator.side === 'attack' ? 'side-attack' : 'side-defense'}">
	<a
		href="/operators/{operator.slug}"
		data-tile
		onclick={select}
		onpointerenter={() => onpreview?.(operator)}
		onfocus={() => onpreview?.(operator)}
		class="relative block aspect-square overflow-hidden border bg-surface transition duration-200 group-hover:-translate-y-0.5 {active
			? 'border-(--side) shadow-[0_0_24px_-6px_var(--side)]'
			: 'border-line group-hover:border-(--side)/70'}"
	>
		<div
			class="absolute inset-0 bg-[linear-gradient(160deg,transparent_30%,var(--side)_160%)] opacity-40 transition-opacity group-hover:opacity-70"
		></div>
		<img
			bind:this={portrait}
			src={operator.portrait}
			alt=""
			loading="lazy"
			decoding="async"
			class="absolute inset-0 size-full scale-[1.35] object-cover object-[50%_8%] transition-transform duration-300 group-hover:scale-[1.45]"
		/>
		<div
			class="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-linear-to-t from-[color-mix(in_oklab,var(--side)_38%,black)] via-black/80 to-transparent px-2 pt-6 pb-1.5"
		>
			<img src={operator.badge} alt="" loading="lazy" class="size-6 shrink-0" />
			<span class="truncate font-display text-sm font-bold tracking-wider uppercase sm:text-base">
				{operator.name}
			</span>
		</div>
		<span class="absolute top-0 left-0 h-full w-0.5 bg-(--side)"></span>
		{#if operator.isNew}
			<span
				class="absolute top-1.5 left-1.5 bg-(--side) px-2.5 py-0.5 font-display text-[10px] font-bold tracking-[0.2em] text-black uppercase shadow-[0_0_12px_var(--side)] clip-tab"
				>New</span
			>
		{/if}
	</a>
	<FavoriteButton
		slug={operator.slug}
		name={operator.name}
		class="absolute top-1 right-1 size-7 bg-black/50 backdrop-blur-sm"
	/>
</div>
