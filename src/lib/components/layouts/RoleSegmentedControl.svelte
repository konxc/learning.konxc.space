<script lang="ts">
	import { RADIUS, COLOR, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import { onMount } from 'svelte';

	let {
		activeRole,
		availableRoles = []
	}: {
		activeRole: string;
		availableRoles: string[];
	} = $props();

	// Role configuration with icons and labels
	const roleConfigs: Record<string, { label: string; icon: string }> = {
		admin: { label: 'Admin', icon: '🛡️' },
		mentor: { label: 'Mentor', icon: '👨‍🏫' },
		learner: { label: 'Learner', icon: '🎓' },
		user: { label: 'Learner', icon: '🎓' }
	};

	function switchRole(role: string) {
		if (role === activeRole) return;

		// Set cookie (expires in 30 days)
		const expires = new Date();
		expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000);
		document.cookie = `active-role=${role};expires=${expires.toUTCString()};path=/;SameSite=Lax`;

		// Refresh to apply new role context
		window.location.reload();
	}

	// Calculate sliding pill position
	let activeIndex = $derived(availableRoles.indexOf(activeRole));
</script>

{#if availableRoles.length > 1}
	<div
		class={`relative flex items-center p-1 bg-zinc-100/80 dark:bg-white/5 ${RADIUS.badge} border border-zinc-200/50 dark:border-white/5 backdrop-blur-md shadow-inner`}
	>
		<!-- Sliding Background Pill -->
		<div
			class={`absolute h-[calc(100%-8px)] transition-all ${TRANSITION.spring} bg-white dark:bg-zinc-800 ${RADIUS.badge} ${ELEVATION.base} border border-white/20 dark:border-white/5 shadow-sm`}
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
