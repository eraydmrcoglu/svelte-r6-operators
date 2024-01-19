<script lang="ts">
	import { titleCaseWord } from '$lib/utils/title-case-word';
	import Badge from './Badge.svelte';
	import OperatorStatistics from './OperatorStatistics.svelte';

	export let name: string;
	export let badge: string;
	export let image: string;
	export let bio: string;
	export let armor_rating: number;
	export let speed_rating: number;
	export let type: string;
	export let organization: string;
	export let selectedOperator: Operator | undefined;
</script>

<button
	class="relative bg-card-background py-8 flex flex-col text-center justify-center rounded-b-lg shadow-md cursor-pointer group"
	on:click={() => {
		selectedOperator = {
			name,
			badge,
			image,
			bio,
			armor_rating,
			speed_rating,
			type,
			organization
		};
	}}
>
	<img
		class="absolute -top-20 left-1/2 -translate-x-1/2 group-hover:scale-110 transition duration-300"
		src={image}
		alt="Profile image of {name}"
		width={280}
	/>
	<img
		class="absolute top-32 left-1/2 -translate-x-1/2"
		src={badge}
		alt="Operator badge of {name}"
		width={65}
		height={65}
	/>

	<div class="mt-40 mx-auto">
		<h1 class="text-2xl font-bold tracking-wide">{titleCaseWord(name)}</h1>
		<Badge color={'bg-' + type} label={type} />

		<div class="my-10">
			<OperatorStatistics armorRating={armor_rating} speedRating={speed_rating} />
		</div>
	</div>
</button>
