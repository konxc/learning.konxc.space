<script lang="ts">
	import { RADIUS, COLOR, ELEVATION, SPACING } from '$lib/config/design';
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
	<div class={padding ? SPACING.section : ''}>
		{@render children?.()}
	</div>
{:else}
	<div
		class={`${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${padding ? SPACING.cardPadding : ''} ${ELEVATION.base}`}
	>
		{@render children?.()}
	</div>
{/if}
