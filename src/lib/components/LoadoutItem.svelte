<script lang="ts">
	import type { LoadoutItem } from '$lib/types';

	let { item }: { item: LoadoutItem } = $props();
	let failed = $state(false);
</script>

<li
	class="group flex items-center gap-4 border border-line bg-surface/70 p-3 transition hover:border-(--side)/60"
>
	<div class="grid h-12 w-24 shrink-0 place-items-center">
		{#if !failed}
			<img
				src="/loadout/{item.slug}.webp"
				alt=""
				loading="lazy"
				class="max-h-full max-w-full object-contain opacity-80 invert transition group-hover:opacity-100"
				onerror={() => (failed = true)}
			/>
		{/if}
	</div>
	<div class="min-w-0">
		<p class="truncate font-display text-lg leading-tight font-bold tracking-wide uppercase">
			{item.name}
		</p>
		{#if item.type}<p class="font-mono text-[10px] tracking-widest text-muted uppercase">
				{item.type}
			</p>{/if}
	</div>
</li>
