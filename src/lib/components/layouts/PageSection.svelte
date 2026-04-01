<script lang="ts">
	import { RADIUS, COLOR, ELEVATION, SPACING } from '$lib/config/design';
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		children,
		padding = true,
		noCard = false
	}: {
		title?: string;
		description?: string;
		children?: Snippet;
		padding?: boolean;
		noCard?: boolean;
	} = $props();
</script>

{#if noCard}
	<div class={padding ? SPACING.section : ''}>
		{#if title}
			<h3 class="mb-1 text-lg font-bold">{title}</h3>
			{#if description}
				<p class="mb-4 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
			{/if}
		{/if}
		{@render children?.()}
	</div>
{:else}
	<div
		class={`${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${padding ? SPACING.cardPadding : ''} ${ELEVATION.base}`}
	>
		{#if title}
			<h3 class="mb-1 text-lg font-bold">{title}</h3>
			{#if description}
				<p class="mb-4 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
			{/if}
		{/if}
		{@render children?.()}
	</div>
{/if}
