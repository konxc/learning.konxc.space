<script lang="ts">
	import { RADIUS, COLOR, ELEVATION } from '$lib/config/design';
	import type { Snippet } from 'svelte';

	let {
		children,
		padding = true,
		noCard = false
	}: {
		children?: Snippet;
		padding?: boolean;
		noCard?: boolean;
	} = $props();
</script>

{#if noCard}
	<div class={`m-2 ${padding ? 'p-1 md:p-2' : ''}`}>
		{@render children?.()}
	</div>
{:else}
	<div
		class={`m-2 ${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${padding ? 'p-2 md:p-3' : ''} ${ELEVATION.base}`}
	>
		{@render children?.()}
	</div>
{/if}
