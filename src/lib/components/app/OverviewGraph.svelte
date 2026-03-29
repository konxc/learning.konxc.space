<script lang="ts">
	import { COLOR, RADIUS, SPACING, TEXT, ELEVATION } from '$lib/config/design';

	interface OverviewGraphProps {
		title?: string;
		description?: string;
		noCard?: boolean;
		dataPoints?: number[]; // Real data points for the graph
	}

	let { title = 'Overview', description, noCard = false, dataPoints = [] }: OverviewGraphProps = $props();

	// Calculate max for normalization
	const maxVal = $derived(dataPoints.length > 0 ? Math.max(...dataPoints, 1) : 100);
</script>

<div
	class={noCard
		? ''
		: `${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.base}`}
>
	<div class="flex items-start justify-between">
		<div>
			<div class={`${TEXT.h4} ${COLOR.textPrimary} mb-1`}>{title}</div>
			{#if description}
				<div class={`${TEXT.small} ${COLOR.textSecondary} mb-4`}>{description}</div>
			{/if}
		</div>
	</div>

	<div class="flex h-48 items-end gap-2 pb-2">
		{#if dataPoints.length > 0}
			{#each dataPoints as point, i}
				{@const height = (point / maxVal) * 100}
				<div
					class="w-full rounded-t-sm bg-blue-500/20 transition-all duration-300 hover:bg-blue-500/40"
					style="height: {height}%"
					title="Value: {point}"
				></div>
			{/each}
		{:else}
			<div class="flex w-full items-center justify-center border-2 border-dashed border-zinc-100 rounded-xl dark:border-zinc-800">
				<p class="text-xs font-bold text-zinc-300 uppercase tracking-widest">No Activity Data</p>
			</div>
		{/if}
	</div>
</div>
