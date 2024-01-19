<script lang="ts">
	import LoadingAnimation from './LoadingAnimation.svelte';

	export let showSplashScreen: boolean;
</script>

{#if showSplashScreen}
	<div
		class="splash-screen fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-dark-gray"
	>
		<LoadingAnimation />
	</div>
{/if}
