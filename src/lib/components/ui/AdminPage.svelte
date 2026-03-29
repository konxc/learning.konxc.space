<script lang="ts">
	import { SPACING, TEXT, COLOR } from '$lib/config/design';
	import StatCard from './StatCard.svelte';
	import type { Snippet } from 'svelte';

	interface AdminPageProps {
		title: string;
		description?: string;
		children?: Snippet;
		headerActions?: Snippet;
		stats?: Array<{
			value: string | number;
			label: string;
			variant?: 'default' | 'success' | 'warning' | 'error' | 'accent' | 'purple';
		}>;
		filters?: Snippet;
	}

	let {
		title,
		description,
		children,
		headerActions,
		stats,
		filters
	}: AdminPageProps = $props();
</script>

<div class={`${SPACING.page} ${SPACING.section}`}>
	<!-- Header -->
	<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<div class="flex-1">
			<h1 class={`${TEXT.h1} ${COLOR.textPrimary} mb-2`}>{title}</h1>
			{#if description}
				<p class={`${TEXT.secondary}`}>{description}</p>
			{/if}
		</div>
		{#if headerActions}
			<div class="flex items-center gap-3">
				{@render headerActions()}
			</div>
		{/if}
	</div>

	<!-- Stats -->
	{#if stats && stats.length > 0}
		<div class="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
			{#each stats as stat}
				<StatCard value={stat.value} label={stat.label} variant={stat.variant || 'default'} />
			{/each}
		</div>
	{/if}

	<!-- Filters -->
	{#if filters}
		<div class="mb-6">
			{@render filters()}
		</div>
	{/if}

	<!-- Content -->
	{#if children}
		{@render children()}
	{/if}
</div>
