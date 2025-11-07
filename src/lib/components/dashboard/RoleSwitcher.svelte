<script lang="ts">
	import { ROLES, type UserRole } from '$lib/constants/roles';
	import { activeRole } from '$lib/hooks/useRole';
	import { setRole } from '$lib/stores/user';

	function onChange(e: Event) {
		const value = (e.target as HTMLSelectElement).value as UserRole;
		setRole(value);
	}
</script>

<label for="role-select" class="text-xs text-neutral-600">Role</label>
<select
	id="role-select"
	class="mt-1 w-full rounded-md border px-2 py-1 text-sm"
	onchange={onChange}
	bind:value={$activeRole}
>
	{#each ROLES as r}
		<option value={r}>{r}</option>
	{/each}
</select>
