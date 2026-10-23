<script lang="ts">
	let { color, label = '', size = 64 }: { color: string; label?: string; size?: number } = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 64 64"
	aria-hidden="true"
	style="filter: drop-shadow(0 0 10px {color}66)"
>
	<defs>
		<linearGradient id="g-{color.slice(1)}" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="white" stop-opacity="0.55" />
			<stop offset="0.45" stop-color={color} />
			<stop offset="1" stop-color="black" stop-opacity="0.6" />
		</linearGradient>
	</defs>
	<polygon points="32,2 59,17 59,47 32,62 5,47 5,17" fill={color} opacity="0.25" />
	<polygon
		points="32,7 54,19.5 54,44.5 32,57 10,44.5 10,19.5"
		fill="url(#g-{color.slice(1)})"
		stroke={color}
		stroke-width="1.5"
	/>
	<polygon points="32,16 44,23 44,41 32,48 20,41 20,23" fill="black" opacity="0.35" />
	{#if label}
		<text
			x="32"
			y="38"
			text-anchor="middle"
			font-family="Rajdhani, sans-serif"
			font-weight="700"
			font-size={label.length > 2 ? 13 : 17}
			fill="white">{label}</text
		>
	{/if}
</svg>
