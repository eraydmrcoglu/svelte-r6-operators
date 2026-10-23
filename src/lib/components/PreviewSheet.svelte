<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { X } from '@lucide/svelte';
	import type { Operator } from '$lib/types';
	import OperatorPreview from './OperatorPreview.svelte';

	let { operator, onclose }: { operator: Operator | null; onclose: () => void } = $props();
</script>

<svelte:window onkeydown={(e) => operator && e.key === 'Escape' && onclose()} />

{#if operator}
	<div
		class="fixed inset-0 z-40 lg:hidden"
		role="dialog"
		aria-modal="true"
		aria-label={operator.name}
	>
		<button
			type="button"
			class="absolute inset-0 bg-black/70 backdrop-blur-sm"
			aria-label="Close preview"
			onclick={onclose}
			transition:fade={{ duration: 150 }}
		></button>
		<div
			class="absolute inset-x-0 bottom-0 h-[88dvh] max-h-[760px]"
			transition:fly={{ y: 400, duration: 260 }}
		>
			<button
				type="button"
				class="absolute -top-12 right-3 z-10 grid size-10 place-items-center border border-line bg-bg text-muted hover:text-fg"
				aria-label="Close preview"
				onclick={onclose}><X size={20} /></button
			>
			<OperatorPreview {operator} />
		</div>
	</div>
{/if}
