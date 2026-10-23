<script lang="ts">
	import { Star } from '@lucide/svelte';
	import { favorites } from '$lib/favorites.svelte';

	let {
		slug,
		name,
		class: className = ''
	}: { slug: string; name: string; class?: string } = $props();
	const active = $derived(favorites.has(slug));
</script>

<button
	type="button"
	onclick={() => favorites.toggle(slug)}
	aria-pressed={active}
	aria-label="{active ? 'Remove' : 'Add'} {name} {active ? 'from' : 'to'} favorites"
	class="grid place-items-center transition {active
		? 'text-yellow-400'
		: 'text-white/40 hover:text-white'} {className}"
>
	<Star size={16} fill={active ? 'currentColor' : 'none'} />
</button>
