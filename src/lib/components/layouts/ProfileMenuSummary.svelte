<script lang="ts">
	import { RADIUS, TEXT, COLOR, TRANSITION } from '$lib/config/design';
	import { m } from '$lib/paraglide/messages.js';

interface User {
	fullName?: string | null;
	username?: string | null;
	avatarUrl?: string | null;
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

<summary
	aria-label="Open profile menu"
	class={`flex w-[200px] cursor-pointer list-none items-center justify-between no-underline ${RADIUS.button} px-2 py-1.5 ${TEXT.button} ${COLOR.textPrimary} bg-gray-100 dark:bg-neutral-800/70 ${TRANSITION.all} hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:hover:bg-neutral-700/80 dark:focus-visible:ring-offset-neutral-900`}
>
	<div class="flex min-w-0 flex-1 items-center gap-2">
		{#if user?.avatarUrl}
			<img
				src={user.avatarUrl}
				alt="avatar"
				class={`h-7 w-7 shrink-0 ${RADIUS.badge} object-cover ring-1 ring-gray-200/50 dark:ring-neutral-700/50 ${isEmulating
					? 'ring-2 ring-amber-400/60 dark:ring-amber-500/60'
					: ''}`}
				loading="lazy"
				decoding="async"
				fetchpriority="low"
			/>
		{:else}
			<div
				class={`grid h-7 w-7 shrink-0 place-items-center ${RADIUS.badge} bg-linear-to-br from-blue-500 to-purple-600 text-xs font-semibold text-white shadow-sm ${isEmulating
					? 'ring-2 ring-amber-400/60 dark:ring-amber-500/60'
					: ''}`}
			>
				{(user?.fullName ?? user?.username ?? 'U').slice(0, 1).toUpperCase()}
			</div>
		{/if}
		<div class="hidden min-w-0 flex-1 flex-col md:flex">
			<span class="max-w-[120px] truncate ${COLOR.textPrimary} font-medium text-xs leading-tight">
				{user?.fullName ?? user?.username ?? m.profile()}
			</span>
			{#if isEmulating}
				<span
					class={`inline-flex items-center gap-1 max-w-fit ${RADIUS.badge} px-1.5 py-0.5 mt-0.5 ${TEXT.small} font-semibold bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400`}
					title="Mode Emulasi: {emulatedRoleLabel}"
				>
					<span class="text-[10px]" aria-hidden="true">🔍</span>
					<span class="text-[10px] leading-none">{emulatedRoleLabel}</span>
				</span>
			{/if}
		</div>
	</div>
	<svg
		class="hidden h-4 w-4 shrink-0 md:block ${COLOR.textSecondary} transition-transform group-open:rotate-180"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
	</svg>
</summary>
