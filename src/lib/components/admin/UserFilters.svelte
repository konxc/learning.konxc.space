<script lang="ts">
	import StatusFilter from '$lib/components/ui/StatusFilter.svelte';

	interface UserFiltersProps {
		roleFilter?: string;
		roleCounts: Record<string, number>;
		onRoleFilterChange?: (value: string) => void;
	}

	let {
		roleFilter = $bindable('all'),
		roleCounts,
		onRoleFilterChange
	}: UserFiltersProps = $props();

	const options = [
		{ value: 'all', label: 'All', count: roleCounts.all ?? 0 },
		{ value: 'admin', label: 'Admins', count: roleCounts.admin ?? 0 },
		{ value: 'mentor', label: 'Mentors', count: roleCounts.mentor ?? 0 },
		{ value: 'user', label: 'Users', count: roleCounts.user ?? 0 }
	];
</script>

<StatusFilter {options} bind:active={roleFilter} onChange={onRoleFilterChange} />
