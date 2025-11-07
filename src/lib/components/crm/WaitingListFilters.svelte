<script lang="ts">
	import { RADIUS, COLOR, SPACING, TEXT, TRANSITION, ELEVATION } from '$lib/config/design';

	export interface WaitingListFiltersProps {
		statusFilter?: string;
		statusCounts: Record<string, number>;
		onStatusFilterChange?: (value: string) => void;
	}

	let {
		statusFilter = $bindable(''),
		statusCounts,
	onStatusFilterChange
}: WaitingListFiltersProps = $props();

	// Status filter options for buttons
	const statusFilterOptions: Array<{
		value: string;
		label: string;
		countKey: string;
	}> = [
		{ value: '', label: 'All', countKey: 'all' },
		{ value: 'new', label: 'New', countKey: 'new' },
		{ value: 'contacted', label: 'Contacted', countKey: 'contacted' },
		{ value: 'qualified', label: 'Qualified', countKey: 'qualified' },
		{ value: 'converted', label: 'Converted', countKey: 'converted' },
		{ value: 'archived', label: 'Archived', countKey: 'archived' }
	];

	// Debug: Log statusCounts untuk development
	$effect(() => {
		if (import.meta.env.DEV) {
			console.log('[WaitingListFilters] statusCounts:', statusCounts);
		}
	});
</script>

<div class="flex flex-wrap items-center gap-2">
	{#each statusFilterOptions as option}
		<button
			type="button"
			class={`cursor-pointer ${RADIUS.button} ${SPACING.button} ${TEXT.button} ${TRANSITION.all} ${
				statusFilter === option.value
					? `${COLOR.accentBg} border-transparent text-white shadow-sm hover:opacity-90`
					: `border border-gray-300 dark:border-neutral-600 ${COLOR.textPrimary} bg-white hover:border-gray-400 hover:bg-gray-50 dark:bg-neutral-800 dark:hover:border-neutral-500 dark:hover:bg-neutral-700`
			} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1 dark:focus-visible:ring-blue-500/70`}
			onclick={() => {
				statusFilter = option.value;
				onStatusFilterChange?.(option.value);
			}}
		>
			{option.label} ({statusCounts[option.countKey] ?? 0})
		</button>
	{/each}
</div>
