<script lang="ts">
	import FilterButtonGroup from '$lib/components/ui/FilterButtonGroup.svelte';
	import type { MentorApplicationFilterType } from '$lib/constants/mentor-applications';
	import { MENTOR_APPLICATION_STATUS_LABELS } from '$lib/constants/mentor-applications';

	interface MentorApplicationFiltersProps {
		statusFilter?: MentorApplicationFilterType;
		statusCounts: Record<string, number>;
		onStatusFilterChange?: (value: MentorApplicationFilterType) => void;
	}

	let {
		statusFilter = $bindable('all'),
		statusCounts,
		onStatusFilterChange
	}: MentorApplicationFiltersProps = $props();

	const filters = [
		{ value: 'all', label: MENTOR_APPLICATION_STATUS_LABELS.all, count: statusCounts.all ?? 0 },
		{ value: 'pending', label: MENTOR_APPLICATION_STATUS_LABELS.pending, count: statusCounts.pending ?? 0 },
		{ value: 'approved', label: MENTOR_APPLICATION_STATUS_LABELS.approved, count: statusCounts.approved ?? 0 },
		{ value: 'rejected', label: MENTOR_APPLICATION_STATUS_LABELS.rejected, count: statusCounts.rejected ?? 0 }
	];

	function handleChange(value: string) {
		onStatusFilterChange?.(value as MentorApplicationFilterType);
	}
</script>

<FilterButtonGroup {filters} bind:active={statusFilter} onChange={handleChange} />
