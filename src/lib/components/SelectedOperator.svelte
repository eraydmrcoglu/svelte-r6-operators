<script lang="ts">
	import { titleCaseWord } from '$lib/utils/title-case-word';
	import { X } from 'lucide-svelte';
	import { fade, slide } from 'svelte/transition';
	import Badge from './Badge.svelte';
	import OperatorStatistics from './OperatorStatistics.svelte';

	export let selectedOperator: Operator | undefined;
</script>

{#if selectedOperator}
	{#key selectedOperator.name}
		<div
			class="flex xl:hidden flex-col text-center justify-center fixed top-0 left-0 w-full h-full bg-{selectedOperator.type} z-10"
			transition:fade={{ duration: 300 }}
		>
			<button
				class="absolute top-2 right-2 bg-dark p-1 rounded-md"
				on:click={() => (selectedOperator = undefined)}
			>
				<X size={24} class="text-light" />
			</button>
		</div>

		<div
			class="fixed bottom-0 left-0 xl:left-auto xl:right-0 xl:mr-6 w-full xl:w-[28.5rem] h-[80vh] rounded-t-lg shadow-md bg-dark z-20 !overflow-visible"
			transition:slide={{ duration: 300 }}
		>
			<img
				class="absolute -top-28 left-1/2 -translate-x-1/2"
				src={selectedOperator.image}
				alt="Profile image of {selectedOperator.name}"
				width={280}
			/>
			<img
				class="absolute top-24 left-1/2 -translate-x-1/2"
				src={selectedOperator.badge}
				alt="Operator badge of {selectedOperator.name}"
				width={65}
				height={65}
			/>

			<div
				class="mt-40 pb-52 px-6 h-full flex flex-col items-center text-center gap-10 overflow-y-scroll"
			>
				<div>
					<h1 class="text-2xl font-bold tracking-wide">{titleCaseWord(selectedOperator.name)}</h1>
					<Badge color={'bg-' + selectedOperator.type} label={selectedOperator.type} />
				</div>

				<div>
					<h2 class="font-semibold text-lg mb-1">Biography</h2>
					<p>{selectedOperator.bio}</p>
				</div>

				<div>
					<h2 class="font-semibold text-lg mb-1">Organization</h2>
					<Badge color="bg-danger" label={selectedOperator.organization} />
				</div>

				<div>
					<h2 class="font-semibold text-lg mb-1">Statistics</h2>
					<OperatorStatistics
						armorRating={selectedOperator.armor_rating}
						speedRating={selectedOperator.speed_rating}
					/>
				</div>
			</div>
		</div>
	{/key}
{:else}
	<div
		class="hidden xl:flex items-center justify-center fixed bottom-0 right-0 mr-6 w-[28.5rem] h-[80vh] rounded-t-lg bg-dark z-20"
	>
		<img
			class="absolute -top-28 left-1/2 -translate-x-1/2"
			src="operator-placeholder.png"
			alt="Placeholder for the selected operator"
			width={280}
		/>

		<p class="w-40 text-gray-bege text-center">Select an operator to display it here</p>
	</div>
{/if}
