<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';
	import type { LoadoutItem, Operator } from '$lib/types';
	import { roleLabel } from '$lib/filters';
	import StatPips from './StatPips.svelte';
	import FavoriteButton from './FavoriteButton.svelte';

	let { operator }: { operator: Operator } = $props();

	const weapons = $derived([...operator.primaries, ...operator.secondaries]);
</script>

{#snippet icon(item: LoadoutItem, wide: boolean)}
	<li
		class="grid place-items-center border border-line bg-black/30 p-1.5 {wide ? 'h-10' : 'size-10'}"
		title="{item.name}{item.type ? ` · ${item.type}` : ''}"
	>
		<img
			src="/loadout/{item.slug}.webp"
			alt={item.name}
			loading="lazy"
			class="max-h-full max-w-full object-contain opacity-85 invert"
		/>
	</li>
{/snippet}

<aside
	class="hud relative flex h-full flex-col overflow-x-hidden overflow-y-auto border border-line bg-surface/70 backdrop-blur {operator.side ===
	'attack'
		? 'side-attack'
		: 'side-defense'}"
>
	{#key operator.slug}
		<!-- The portrait takes whatever height is left, so the button below never falls off screen. -->
		<div class="relative min-h-40 flex-1 overflow-hidden">
			<div
				class="absolute inset-0 bg-[radial-gradient(circle_at_50%_75%,var(--side),transparent_60%)] opacity-40"
			></div>
			<span
				class="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 font-display text-[6.5rem] leading-none font-bold whitespace-nowrap text-outline uppercase"
				>{operator.name}</span
			>
			<img
				src={operator.portrait}
				alt="{operator.name} portrait"
				class="absolute inset-0 size-full animate-rise object-contain object-bottom"
			/>
			<FavoriteButton
				slug={operator.slug}
				name={operator.name}
				class="absolute top-3 right-3 size-9 border border-line bg-black/50"
			/>
			{#if operator.isNew}
				<span
					class="absolute top-3 left-3 bg-(--side) px-3 py-0.5 font-display text-xs font-bold tracking-[0.2em] text-black uppercase clip-tab"
					>New · {operator.season.code}</span
				>
			{/if}
		</div>

		<div
			class="flex shrink-0 animate-rise flex-col gap-4 border-t border-line p-5"
			style="animation-delay: 60ms"
		>
			<div class="flex items-center gap-3">
				<img src={operator.badge} alt="" class="size-11" />
				<div class="min-w-0 flex-1">
					<p class="label !text-(--side)">
						{operator.side === 'attack' ? 'Attacker' : 'Defender'} · {operator.season.code}
					</p>
					<h2 class="truncate font-display text-4xl leading-none font-bold tracking-wide uppercase">
						{operator.name}
					</h2>
				</div>
			</div>

			<div class="flex flex-wrap gap-1.5">
				{#each operator.roles as role (role)}
					<span class="border border-line px-2 py-0.5 text-[11px] text-muted"
						>{roleLabel(role)}</span
					>
				{/each}
			</div>

			<div class="space-y-1.5">
				<StatPips label="Health" value={operator.armor} size="lg" />
				<StatPips label="Speed" value={operator.speed} size="lg" />
				<StatPips label="Difficulty" value={operator.difficulty} size="lg" />
			</div>

			<div class="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
				<div>
					<p class="mb-1.5 label !text-[10px]">Weapons</p>
					<ul class="grid grid-cols-3 gap-1">
						{#each weapons.slice(0, 6) as item (item.slug)}{@render icon(item, true)}{/each}
					</ul>
				</div>
				<div>
					<p class="mb-1.5 label !text-[10px]">Gadgets</p>
					<ul class="flex gap-1">
						{#each operator.gadgets.slice(0, 3) as item (item.slug)}{@render icon(
								item,
								false
							)}{/each}
					</ul>
				</div>
			</div>

			{#if operator.ability.name}
				<div class="flex items-center gap-3 bg-(--side)/10 p-2.5">
					{#if operator.ability.remoteImage}
						<img
							src="/operators/{operator.slug}/ability.webp"
							alt=""
							class="h-8 w-14 object-contain"
						/>
					{/if}
					<div class="min-w-0">
						<p class="label !text-[10px] !text-(--side)">Unique ability</p>
						<p class="truncate font-display text-lg leading-tight font-bold uppercase">
							{operator.ability.name}
						</p>
					</div>
				</div>
			{/if}

			<a
				href="/operators/{operator.slug}"
				class="flex items-center justify-between bg-(--side) px-5 py-3 font-display text-lg font-bold tracking-widest text-black uppercase transition clip-corner hover:brightness-110"
			>
				Open dossier <ArrowRight size={20} />
			</a>
		</div>
	{/key}
</aside>
