<script lang="ts">
	import { RADIUS, COLOR, ELEVATION } from '$lib/config/design';
	import Skeleton from './Skeleton.svelte';

	export interface ListPageSkeletonProps {
		rows?: number;
		showHeader?: boolean;
		columns?: number;
		class?: string;
	}

	let {
		rows = 5,
		showHeader = true,
		columns = 4,
		class: className = ''
	}: ListPageSkeletonProps = $props();

	const columnWidths = ['w-1/4', 'w-1/4', 'w-1/4', 'w-1/6', 'w-1/6', 'w-1/3'];
</script>

<div
	class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} overflow-hidden ${className}`}
>
	{#if showHeader}
		<!-- Table Header -->
		<div class="flex items-center border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
			{#each Array(columns) as _, i}
				<div class={`${columnWidths[i] || 'w-1/4'} px-2`}>
					<Skeleton class="h-3 w-20" />
				</div>
			{/each}
		</div>
	{/if}

	<!-- Table Rows -->
	{#each Array(rows) as _, rowIndex}
		<div class="flex items-center border-b border-zinc-50 px-5 py-4 dark:border-zinc-800/50">
			{#each Array(columns) as _, colIndex}
				<div class={`${columnWidths[colIndex] || 'w-1/4'} px-2`}>
					{#if colIndex === 0}
						<!-- Avatar + Text -->
						<div class="flex items-center gap-3">
							<Skeleton class="h-8 w-8 rounded-full" />
							<div class="space-y-1">
								<Skeleton class="h-3 w-24" />
								<Skeleton class="h-2 w-16" />
							</div>
						</div>
					{:else if colIndex === columns - 1}
						<!-- Action buttons -->
						<div class="flex gap-2">
							<Skeleton class="h-6 w-12 rounded" />
							<Skeleton class="h-6 w-12 rounded" />
						</div>
					{:else}
						<Skeleton class="h-3 w-full max-w-[100px]" />
					{/if}
				</div>
			{/each}
		</div>
	{/each}
</div>
