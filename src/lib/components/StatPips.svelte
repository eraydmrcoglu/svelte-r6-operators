<script lang="ts">
	let {
		label,
		value,
		max = 3,
		size = 'sm'
	}: { label: string; value: number; max?: number; size?: 'sm' | 'lg' } = $props();
</script>

<div class="flex items-center gap-3" role="img" aria-label="{label} {value} of {max}">
	{#if label}
		<span class="label {size === 'lg' ? 'w-24' : 'w-14 !text-[10px] !tracking-[0.2em]'}"
			>{label}</span
		>
	{/if}
	<span class="flex flex-1 gap-1" aria-hidden="true">
		{#each Array(max) as _, i (i)}
			<span
				class="skew-x-[-24deg] {size === 'lg' ? 'h-2.5 flex-1' : 'h-1.5 w-4'} {i < value
					? 'bg-(--side) shadow-[0_0_10px_var(--side)]'
					: 'bg-white/8'}"
			></span>
		{/each}
	</span>
</div>
