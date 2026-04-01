<script lang="ts">
	import { TEXT, COLOR, RADIUS, EMULATION } from '$lib/config/design';
	import { useRoleColor } from '$lib/utils/useRoleColor';
	import { getRoleLabel } from '$lib/utils/role';

	interface User {
		fullName?: string | null;
		username?: string | null;
		email?: string | null;
		role?: string | null;
	}

	interface Props {
		user: User | null;
		activeRole?: string | null;
	}

	let { user, activeRole }: Props = $props();

	let currentRoleColor = $derived(useRoleColor(activeRole));

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
				{#if activeRole && currentRoleColor && !isEmulating}
					<span
						class={`ml-2 inline-flex items-center gap-1 ${currentRoleColor.bgMuted} ${currentRoleColor.border} border ${RADIUS.badge} px-2 py-0.5 ${TEXT.small} ${currentRoleColor.text} font-bold capitalize`}
					>
						{getRoleLabel(activeRole)}
					</span>
				{/if}
			</div>
			<div class={`${TEXT.small} ${COLOR.textSecondary} mt-0.5 truncate`}>
				{user?.email}
			</div>
		</div>
		{#if isEmulating}
			<div
				class={`shrink-0 ${RADIUS.badge} px-2 py-1 ${TEXT.small} border ${EMULATION.bg} ${EMULATION.text} border-amber-200/50 dark:border-amber-800/30`}
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
