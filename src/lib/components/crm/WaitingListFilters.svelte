<script lang="ts">
	import StatusFilter from '$lib/components/ui/StatusFilter.svelte';

	interface WaitingListFiltersProps {
		statusFilter?: string;
		statusCounts: Record<string, number>;
		onStatusFilterChange?: (value: string) => void;
	}

	let {
		statusFilter = $bindable(''),
		statusCounts,
		onStatusFilterChange
	}: WaitingListFiltersProps = $props();

	const options = [
		{ value: '', label: 'All', count: statusCounts.all ?? 0 },
		{ value: 'new', label: 'New', count: statusCounts.new ?? 0 },
		{ value: 'contacted', label: 'Contacted', count: statusCounts.contacted ?? 0 },
		{ value: 'qualified', label: 'Qualified', count: statusCounts.qualified ?? 0 },
		{ value: 'converted', label: 'Converted', count: statusCounts.converted ?? 0 },
		{ value: 'archived', label: 'Archived', count: statusCounts.archived ?? 0 }
	];

	function handleChange(value: string) {
		statusFilter = value;
		onStatusFilterChange?.(value);
	}
</script>

<StatusFilter {options} bind:active={statusFilter} onChange={handleChange} />
