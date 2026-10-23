<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="py-24 text-center">
	<p class="font-display text-7xl font-bold text-attack">{page.status}</p>
	<p class="mt-2 text-muted">{page.error?.message}</p>
	<a href="/" class="mt-6 inline-block text-sm underline underline-offset-4"
		>Back to all operators</a
	>
</div>
