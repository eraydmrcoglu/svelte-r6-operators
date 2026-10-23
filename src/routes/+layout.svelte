<script lang="ts">
	import '../app.css';
	import { afterNavigate, onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { Menu, X } from '@lucide/svelte';
	import { seasons } from '$lib/data/meta';

	let { children } = $props();
	let menuOpen = $state(false);

	const links = [
		{ href: '/', label: 'Operators' },
		{ href: '/maps', label: 'Maps' },
		{ href: '/ranks', label: 'Ranks' },
		{ href: '/stats', label: 'Stats' },
		{ href: '/compare', label: 'Compare' },
		{ href: '/roulette', label: 'Roulette' }
	];
	const isActive = (href: string) =>
		href === '/'
			? page.url.pathname === '/' || page.url.pathname.startsWith('/operators')
			: page.url.pathname.startsWith(href);
	const season = seasons.at(-1)!;

	afterNavigate(() => (menuOpen = false));

	onNavigate((navigation) => {
		if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches)
			return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<header
	class="sticky top-0 z-30 border-b border-line bg-bg/80 backdrop-blur-md [view-transition-name:site-header]"
>
	<div class="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-4 sm:px-6">
		<a href="/" class="group flex shrink-0 items-center gap-3">
			<img
				src="/r6-icon-100x.png"
				alt=""
				class="size-8 transition group-hover:drop-shadow-[0_0_8px_var(--color-attack)]"
			/>
			<span class="font-display text-lg leading-none font-bold tracking-[0.25em] uppercase">
				R6<span class="text-attack">/</span>Intel
			</span>
		</a>

		<nav class="hidden h-full items-stretch lg:flex" aria-label="Main">
			{#each links as link (link.href)}
				{@const active = isActive(link.href)}
				<a
					href={link.href}
					aria-current={active ? 'page' : undefined}
					class="group relative flex items-center px-5 font-display text-[15px] font-bold tracking-[0.2em] uppercase transition {active
						? 'text-fg'
						: 'text-muted hover:text-fg'}"
				>
					<span
						class="absolute inset-x-1 inset-y-3 transition clip-tab {active
							? 'bg-linear-to-b from-attack/25 to-attack/5'
							: 'bg-white/0 group-hover:bg-white/5'}"
					></span>
					<span class="relative">{link.label}</span>
					{#if active}
						<span
							class="absolute inset-x-4 -bottom-px h-0.5 bg-attack shadow-[0_0_14px_var(--color-attack)]"
						></span>
					{/if}
				</a>
			{/each}
		</nav>

		<div class="ml-auto flex items-center gap-3">
			<span
				class="hidden items-center gap-2 border border-line px-3 py-1 font-mono text-[10px] tracking-widest text-muted uppercase sm:flex"
			>
				<span
					class="size-1.5 animate-pulse rounded-full bg-attack shadow-[0_0_8px_var(--color-attack)]"
				></span>
				{season.code} · {season.name}
			</span>
			<button
				type="button"
				class="grid size-10 place-items-center border border-line text-muted hover:text-fg lg:hidden"
				aria-expanded={menuOpen}
				aria-controls="mobile-menu"
				aria-label={menuOpen ? 'Close menu' : 'Open menu'}
				onclick={() => (menuOpen = !menuOpen)}
			>
				{#if menuOpen}<X size={20} />{:else}<Menu size={20} />{/if}
			</button>
		</div>
	</div>

	{#if menuOpen}
		<nav
			id="mobile-menu"
			class="animate-rise border-t border-line bg-bg/95 px-4 py-3 lg:hidden"
			aria-label="Main"
		>
			{#each links as link (link.href)}
				{@const active = isActive(link.href)}
				<a
					href={link.href}
					aria-current={active ? 'page' : undefined}
					class="flex items-center gap-3 border-l-2 px-4 py-3 font-display text-xl font-bold tracking-[0.2em] uppercase {active
						? 'border-attack bg-attack/10 text-fg'
						: 'border-transparent text-muted'}"
				>
					{link.label}
				</a>
			{/each}
		</nav>
	{/if}
</header>

<div class="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-[1440px] flex-col px-4 sm:px-6">
	<main class="flex-1 pt-6">
		{@render children()}
	</main>

	<footer
		class="mt-16 py-6 text-center font-mono text-[10px] tracking-widest text-muted/50 uppercase"
	>
		© {new Date().getFullYear()} R6 Intel. All rights reserved. · Rainbow Six Siege and its assets are
		trademarks of Ubisoft Entertainment.
	</footer>
</div>
