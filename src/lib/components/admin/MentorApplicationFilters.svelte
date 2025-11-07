<script lang="ts">
	import { RADIUS, COLOR, SPACING, TEXT, TRANSITION } from '$lib/config/design';
	import type { MentorApplicationFilterType } from '$lib/constants/mentor-applications';
	import { MENTOR_APPLICATION_STATUS_LABELS } from '$lib/constants/mentor-applications';

	export interface MentorApplicationFiltersProps {
		statusFilter?: MentorApplicationFilterType;
		statusCounts: Record<string, number>;
		onStatusFilterChange?: (value: MentorApplicationFilterType) => void;
	}

	let {
		statusFilter = $bindable('all'),
		statusCounts,
	onStatusFilterChange
}: MentorApplicationFiltersProps = $props();

	// Status filter options for buttons
	const statusFilterOptions: Array<{
		value: MentorApplicationFilterType;
		label: string;
		countKey: string;
	}> = [
		{ value: 'all', label: MENTOR_APPLICATION_STATUS_LABELS.all, countKey: 'all' },
		{
			value: 'pending',
			label: MENTOR_APPLICATION_STATUS_LABELS.pending,
			countKey: 'pending'
		},
		{
			value: 'approved',
			label: MENTOR_APPLICATION_STATUS_LABELS.approved,
			countKey: 'approved'
		},
		{
			value: 'rejected',
			label: MENTOR_APPLICATION_STATUS_LABELS.rejected,
			countKey: 'rejected'
		}
	];
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

