<script lang="ts">
	import '../app.css';
	import { operators } from '../lib/data/operators';
	import OperatorCard from '../lib/components/OperatorCard.svelte';
	import OperatorSearchBar from '$lib/components/OperatorSearchBar.svelte';
	import SelectedOperator from '$lib/components/SelectedOperator.svelte';
	import SplashScreen from '$lib/components/SplashScreen.svelte';
	import { onMount } from 'svelte';

	let showSplashScreen: boolean = true;
	onMount(() => {
		showSplashScreen = false;
	});

	let search: string = '';
	$: filteredOperators =
		search && search.length > 0
			? operators.filter((operator) => operator.name.toLowerCase().startsWith(search.toLowerCase()))
			: operators;

	let selectedOperator: Operator | undefined;
	onMount(() => {
		window.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				selectedOperator = undefined;
			}
		});
	});
</script>

<main class="mx-6 flex min-h-screen">
	<SplashScreen {showSplashScreen} />

	<div class="content relative xl:mr-[30rem]">
		<OperatorSearchBar bind:search />
		<div class="operator-list gap-x-6 gap-y-28 my-24">
			{#each filteredOperators as operator}
				<OperatorCard {...operator} bind:selectedOperator />
			{/each}
		</div>
	</div>
	<style>
		.content {
			display: grid;
			grid-template-rows: min-content 1fr min-content;
			min-height: 100%;
			width: 100%;
		}
	</style>

	<SelectedOperator bind:selectedOperator />

	<style>
		.content {
			display: grid;
			grid-template-rows: min-content 1fr min-content;
			min-height: 100%content;
			width: 100%;
		}

		.operator-list {
			display: grid;
			gap: 8rem 2rem;
			grid-template-columns: repeat(auto-fit, minmax(min(20rem, 100%), 1fr));
		}
	</style>
</main>
