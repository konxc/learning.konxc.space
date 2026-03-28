<script lang="ts">
	// Placeholder grafik overview (bisa diganti chart lib)
	import { COLOR, RADIUS, SPACING, TEXT, ELEVATION } from '$lib/config/design';

	interface OverviewGraphProps {
		title?: string;
		description?: string;
		noCard?: boolean;
	}

	let { title = 'Overview', description, noCard = false }: OverviewGraphProps = $props();
</script>

<div
	class={noCard
		? ''
		: `${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.base}`}
>
	<div class={`${TEXT.h4} ${COLOR.textPrimary} mb-1`}>{title}</div>
	{#if description}
		<div class={`${TEXT.small} ${COLOR.textSecondary} mb-4`}>{description}</div>
	{/if}
	<div class="flex h-48 items-end gap-2 pb-2">
		{#each Array(12) as _, i}
			{@const height = Math.floor(Math.random() * 80) + 20}
			<div
				class="w-full rounded-t-sm bg-indigo-500/20 transition-all duration-300 hover:bg-indigo-500/40"
				style="height: {height}%"
				title="Day {i + 1}"
			></div>
		{/each}
	</div>
</div>
