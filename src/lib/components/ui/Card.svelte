<script lang="ts">
	import { RADIUS, ELEVATION, COLOR, SPACING, TEXT } from '$lib/config/design';
	import type { Snippet } from 'svelte';

	interface CardProps {
		title?: string;
		subtitle?: string;
		children?: Snippet;
	}

	let { title, subtitle, children }: CardProps = $props();
</script>

<div
	class={`${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.base} ${ELEVATION.hover} ${ELEVATION.transition}`}
>
	{#if title}
		<div class={`mb-1 ${TEXT.h2} ${COLOR.textPrimary}`}>{title}</div>
	{/if}
	{#if subtitle}
		<div class={`mb-2 text-xs ${COLOR.textSecondary}`}>{subtitle}</div>
	{/if}
	<div>
		{#if children}
			{@render children?.()}
		{/if}
	</div>
</div>
