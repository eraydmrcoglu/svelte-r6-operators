<script lang="ts">
	export let armorRating: number;
	export let speedRating: number;
</script>

<div class="flex gap-14">
	<div class="flex flex-col items-center gap-2">
		<h2 class="uppercase font-light">Armor</h2>
		<div class="flex gap-2">
			{#each Array(armorRating) as _, i}
				<div class="h-4 w-4 bg-light rounded-full" />
			{/each}
			{#each Array(3 - armorRating) as _, i}
				<div class="h-4 w-4 bg-gray-bege rounded-full" />
			{/each}
		</div>
	</div>
	<div class="flex flex-col items-center gap-2">
		<h2 class="uppercase font-light">Speed</h2>
		<div class="flex gap-2">
			{#each Array(speedRating) as _, i}
				<div class="h-4 w-4 bg-light rounded-full" />
			{/each}
			{#each Array(3 - speedRating) as _, i}
				<div class="h-4 w-4 bg-gray-bege rounded-full" />
			{/each}
		</div>
	</div>
</div>
