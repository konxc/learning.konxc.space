<script lang="ts">
	import StatusFilter from '$lib/components/ui/StatusFilter.svelte';
	import type { PaymentProofStatus } from '$lib/constants/payment-proofs';

	interface PaymentProofFiltersProps {
		statusFilter?: 'all' | PaymentProofStatus;
		statusCounts: Record<string, number>;
		onStatusFilterChange?: (value: 'all' | PaymentProofStatus) => void;
	}

	let {
		statusFilter = $bindable('all'),
		statusCounts,
		onStatusFilterChange
	}: PaymentProofFiltersProps = $props();

	const options = [
		{ value: 'all', label: 'All', count: statusCounts.all ?? 0 },
		{ value: 'pending', label: 'Pending', count: statusCounts.pending ?? 0 },
		{ value: 'approved', label: 'Approved', count: statusCounts.approved ?? 0 },
		{ value: 'rejected', label: 'Rejected', count: statusCounts.rejected ?? 0 }
	];

	function handleChange(value: string) {
		onStatusFilterChange?.(value as 'all' | PaymentProofStatus);
	}
</script>

<StatusFilter {options} bind:active={statusFilter} onChange={handleChange} />
