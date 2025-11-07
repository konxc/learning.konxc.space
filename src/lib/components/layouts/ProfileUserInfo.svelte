<script lang="ts">
	import { TEXT, COLOR, RADIUS } from '$lib/config/design';

interface User {
	fullName?: string | null;
	username?: string | null;
	email?: string | null;
	role?: string | null;
}

	function getRoleLabel(role: string | null | undefined): string {
		if (!role) return '';
		const roleMap: Record<string, string> = {
			admin: 'Admin',
			mentor: 'Mentor',
			siswa: 'Siswa',
			user: 'Siswa'
		};
		return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1);
	}

	let { user, activeRole }: { user: User | null; activeRole?: string | null } = $props();

	// Check if emulation mode is active
	const isEmulating = $derived(
		user?.role === 'admin' && activeRole && activeRole !== user.role && activeRole !== 'admin'
	);
	const emulatedRoleLabel = $derived(isEmulating ? getRoleLabel(activeRole) : '');
</script>

<div class="px-3 py-2.5">
	<div class="flex items-start justify-between gap-2">
		<div class="min-w-0 flex-1">
			<div class={`${TEXT.button} ${COLOR.textPrimary} truncate font-semibold`}>
				{user?.fullName ?? user?.username}
			</div>
			<div class={`${TEXT.small} ${COLOR.textSecondary} mt-0.5 truncate`}>
				{user?.email}
			</div>
		</div>
		{#if isEmulating}
			<div
				class={`shrink-0 ${RADIUS.badge} px-2 py-1 ${TEXT.small} border border-amber-200/50 bg-amber-100 font-semibold text-amber-700 dark:border-amber-800/30 dark:bg-amber-950/40 dark:text-amber-400`}
				title="Mode Emulasi: {emulatedRoleLabel}"
			>
				<span class="inline-flex items-center gap-1">
					<span class="text-xs" aria-hidden="true">🔍</span>
					<span class="text-xs leading-none">{emulatedRoleLabel}</span>
				</span>
			</div>
		{/if}
	</div>
</div>
<hr class="my-1 border-gray-200 dark:border-neutral-800" />
