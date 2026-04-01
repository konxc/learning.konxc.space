<script lang="ts">
	import StatusFilter from '$lib/components/ui/StatusFilter.svelte';

	interface CourseFiltersProps {
		statusFilter?: string;
		statusCounts: Record<string, number>;
		onStatusFilterChange?: (value: string) => void;
	}

	let {
		statusFilter = $bindable('all'),
		statusCounts,
		onStatusFilterChange
	}: CourseFiltersProps = $props();

	const options = [
		{ value: 'all', label: 'All', count: statusCounts.all ?? 0 },
		{ value: 'published', label: 'Published', count: statusCounts.published ?? 0 },
		{ value: 'draft', label: 'Draft', count: statusCounts.draft ?? 0 }
	];
</script>

<StatusFilter {options} bind:active={statusFilter} onChange={onStatusFilterChange} />
