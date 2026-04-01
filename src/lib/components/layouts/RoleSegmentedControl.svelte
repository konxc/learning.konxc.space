<script lang="ts">
	import { RADIUS, COLOR, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import { invalidateAll } from '$app/navigation';

	let {
		activeRole,
		availableRoles = []
	}: {
		activeRole: string;
		availableRoles: string[];
	} = $props();

	const ACTIVE_ROLE_COOKIE = 'active-role';
	const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (unified with RoleSwitcherAccordion)

	// Role configuration with icons and labels
	const roleConfigs: Record<string, { label: string; icon: string }> = {
		admin: { label: 'Admin', icon: '🛡️' },
		mentor: { label: 'Mentor', icon: '👨‍🏫' },
		siswa: { label: 'Siswa', icon: '🎓' },
		user: { label: 'Siswa', icon: '🎓' }
	};

	async function switchRole(role: string) {
		if (role === activeRole) return;

		// Set cookie
		if (typeof document !== 'undefined') {
			document.cookie = `${ACTIVE_ROLE_COOKIE}=${role}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
		}

		// Sync with server for audit log
		try {
			await fetch(`/app/switch-role?role=${role}`, {
				method: 'GET',
				credentials: 'include'
			});
		} catch (error) {
			console.warn('Failed to sync role switch with server:', error);
		}

		// SPA navigation (no full page reload)
		await invalidateAll();
	}

	// Calculate sliding pill position
	let activeIndex = $derived(availableRoles.indexOf(activeRole));
</script>

{#if availableRoles.length > 1}
	<div
		class={`relative flex items-center bg-zinc-100/80 p-1 dark:bg-white/5 ${RADIUS.badge} border border-zinc-200/50 shadow-inner backdrop-blur-md dark:border-white/5`}
	>
		<!-- Sliding Background Pill -->
		<div
			class={`absolute h-[calc(100%-8px)] transition-all ${TRANSITION.spring} bg-white dark:bg-zinc-800 ${RADIUS.badge} ${ELEVATION.base} border border-white/20 shadow-sm dark:border-white/5`}
			style="width: calc((100% - 8px) / {availableRoles.length}); transform: translateX(calc({activeIndex} * 100%));"
		></div>

		{#each availableRoles as role}
			<button
				type="button"
				onclick={() => switchRole(role)}
				class={`relative z-10 flex flex-1 items-center justify-center gap-1.5 px-1 py-1.5 text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${
					activeRole === role
						? COLOR.textPrimary
						: 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
				}`}
				aria-pressed={activeRole === role}
			>
				<span class="text-xs opacity-80">{roleConfigs[role]?.icon || '👤'}</span>
				<span class="truncate">{roleConfigs[role]?.label || role}</span>
			</button>
		{/each}
	</div>
{/if}
