<script lang="ts">
	import { ROLES, ROLE_ALIASES, ROLE_SWITCH_MAP, type UserRole } from '$lib/constants/roles';
	import { activeRole } from '$lib/hooks/useRole';
	import { setRole } from '$lib/stores/user';
	import { RADIUS, COLOR, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import { fade, fly } from 'svelte/transition';

	let { userRole = 'user' }: { userRole?: string } = $props();

	let isOpen = $state(false);

	const roleMap: Record<string, { label: string; icon: string; color: string }> = {
		user: { label: 'Siswa', icon: '🎓', color: 'blue' },
		mentor: { label: 'Mentor', icon: '🖋️', color: 'indigo' },
		bd: { label: 'Business Dev', icon: '📈', color: 'emerald' },
		admin: { label: 'Admin', icon: '🛡️', color: 'red' },
		facilitator: { label: 'Facilitator', icon: '🎯', color: 'orange' }
	};

	// Determine available roles based on ROLE_SWITCH_MAP from roles.ts
	const availableRoles = $derived.by(() => {
		const validRoles = ROLES as readonly string[];
		if (validRoles.includes(userRole)) {
			return ROLE_SWITCH_MAP[userRole as UserRole] ?? [];
		}
		return [];
	});

	// Only show if there is actually a choice to make
	const showSwitcher = $derived(availableRoles.length >= 2);

	function handleRoleChange(role: string) {
		setRole(role as UserRole);
		isOpen = false;
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}
</script>

{#if showSwitcher}
	<div class="relative inline-block">
		<!-- Active Role Pill -->
		<button
			type="button"
			onclick={toggleDropdown}
			class={`group flex items-center gap-3 rounded-2xl border border-zinc-200/60 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur-md transition-all hover:border-blue-500/30 hover:bg-white dark:border-zinc-800/60 dark:bg-zinc-900/80 dark:hover:border-blue-400/30 dark:hover:bg-zinc-900`}
		>
			<div class="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-100 text-sm shadow-inner dark:bg-zinc-800">
				{roleMap[$activeRole]?.icon || '👤'}
			</div>
			<span class="text-xs font-black tracking-widest text-zinc-900 uppercase dark:text-white">
				{roleMap[$activeRole]?.label || 'Select Role'}
			</span>
			<svg
				class={`h-4 w-4 ${COLOR.textMuted} transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		<!-- Premium Dropdown Menu -->
		{#if isOpen}
			<div
				class={`absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-[1.5rem] border border-zinc-200/60 bg-white/95 p-2 shadow-2xl backdrop-blur-2xl dark:border-zinc-800/60 dark:bg-zinc-900/95`}
				in:fly={{ y: 10, duration: 400 }}
				out:fade={{ duration: 200 }}
			>
				{#each availableRoles as role}
					{@const active = $activeRole === role}
					<button
						onclick={() => handleRoleChange(role)}
						class={`group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${
							active
								? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
								: 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-white/5'
						}`}
					>
						<div
							class={`flex h-8 w-8 items-center justify-center rounded-lg text-lg ${
								active ? 'bg-white/20' : 'bg-zinc-100 dark:bg-zinc-800'
							}`}
						>
							{roleMap[role]?.icon || '👤'}
						</div>
						<div class="flex flex-col">
							<span class="text-xs font-black tracking-widest uppercase">
								{roleMap[role]?.label || role}
							</span>
							{#if active}
								<span class="text-[9px] font-bold text-blue-100 uppercase opacity-80">ACTIVE NOW</span>
							{/if}
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Click Outside Overlay -->
	{#if isOpen}
		<div
			class="fixed inset-0 z-40"
			onclick={() => (isOpen = false)}
			onkeydown={() => (isOpen = false)}
			role="button"
			tabindex="-1"
			aria-label="Close menu"
		></div>
	{/if}
{/if}
