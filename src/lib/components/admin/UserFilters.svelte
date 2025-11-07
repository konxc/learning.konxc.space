<script lang="ts">
	import { RADIUS, COLOR, SPACING, TEXT, TRANSITION } from '$lib/config/design';

	export interface UserFiltersProps {
		roleFilter?: string;
		roleCounts: Record<string, number>;
		onRoleFilterChange?: (value: string) => void;
	}

	let {
		roleFilter = $bindable('all'),
		roleCounts,
		onRoleFilterChange
	} = $props<UserFiltersProps>();

	// Role filter options for buttons
	const roleFilterOptions: Array<{
		value: string;
		label: string;
		countKey: string;
	}> = [
		{ value: 'all', label: 'All', countKey: 'all' },
		{ value: 'admin', label: 'Admins', countKey: 'admin' },
		{ value: 'mentor', label: 'Mentors', countKey: 'mentor' },
		{ value: 'user', label: 'Users', countKey: 'user' }
	];
</script>

<div class="flex flex-wrap items-center gap-2">
	{#each roleFilterOptions as option}
		<button
			type="button"
			class={`cursor-pointer ${RADIUS.button} ${SPACING.button} ${TEXT.button} ${TRANSITION.all} ${
				roleFilter === option.value
					? `${COLOR.accentBg} border-transparent text-white shadow-sm hover:opacity-90`
					: `border border-gray-300 dark:border-neutral-600 ${COLOR.textPrimary} bg-white hover:border-gray-400 hover:bg-gray-50 dark:bg-neutral-800 dark:hover:border-neutral-500 dark:hover:bg-neutral-700`
			} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1 dark:focus-visible:ring-blue-500/70`}
			onclick={() => {
				roleFilter = option.value;
				onRoleFilterChange?.(option.value);
			}}
		>
			{option.label} ({roleCounts[option.countKey] ?? 0})
		</button>
	{/each}
</div>

