<script lang="ts">
	import { RADIUS, TEXT, COLOR, TRANSITION, ELEVATION } from '$lib/config/design';
	import { invalidateAll, goto } from '$app/navigation';
	import { toast } from '$lib/stores/toastStore';

	let {
		workspaces,
		fullWidth = false,
		isCollapsed = false
	}: {
		workspaces: {
			organizations: any[];
			activeId: string;
			activeOrg: any;
		};
		fullWidth?: boolean;
		isCollapsed?: boolean;
	} = $props();

	let isOpen = $state(false);

	async function switchWorkspace(id: string) {
		isOpen = false;
		if (id === workspaces.activeId) return;

		try {
			const res = await fetch('/app/api/workspace/switch', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ workspaceId: id })
			});

			if (res.ok) {
				toast.success(`Switched to ${id === 'personal' ? 'Personal' : 'Organization'} workspace`);
				await invalidateAll();
			} else {
				toast.error('Gagal beralih ruang kerja');
			}
		} catch (e) {
			toast.error('Terjadi kesalahan');
		}
	}

	function createOrganization() {
		isOpen = false;
		goto('/app/settings?tab=organization');
	}
</script>

<div class={`relative ${fullWidth ? 'w-full' : ''}`}>
	<button
		onclick={() => (isOpen = !isOpen)}
		class={`flex items-center gap-3 ${isCollapsed ? 'justify-center p-2' : 'w-full p-2.5'} ${RADIUS.card} group relative overflow-hidden border border-zinc-200/50 bg-zinc-50/50 transition-all hover:bg-white active:scale-[0.98] dark:border-zinc-800/50 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/60`}
		aria-expanded={isOpen}
		aria-haspopup="listbox"
	>
		<!-- Interaction Surface -->
		<div
			class="absolute inset-0 bg-linear-to-br from-blue-500/0 to-indigo-500/0 transition-all group-hover:from-blue-500/5 group-hover:to-indigo-500/5"
		></div>

		<div class="relative z-10 flex w-full min-w-0 items-center gap-3">
			{#if workspaces.activeId === 'personal'}
				<div
					class={`flex shrink-0 items-center justify-center rounded-lg bg-blue-600 font-black text-white shadow-md ${isCollapsed ? 'h-8 w-8 text-xs' : 'h-8 w-8 text-sm'}`}
				>
					P
				</div>
				{#if !isCollapsed}
					<div class="min-w-0 flex-1 text-left">
						<div class="mb-1 flex items-center gap-1.5">
							<p
								class="text-[10px] leading-none font-black tracking-widest text-blue-600 uppercase"
							>
								Personal
							</p>
							<span
								class="rounded-full bg-zinc-100 px-1.5 py-0.5 text-[8px] font-black tracking-widest text-zinc-500 uppercase dark:bg-zinc-800 dark:text-zinc-400"
								>Free</span
							>
						</div>
						<p class="truncate text-xs font-bold text-zinc-900 dark:text-zinc-100">Account</p>
					</div>
				{/if}
			{:else}
				<div
					class={`shrink-0 overflow-hidden rounded-lg shadow-md ring-1 ring-black/5 dark:ring-white/10 ${isCollapsed ? 'h-8 w-8' : 'h-8 w-8'}`}
				>
					{#if workspaces.activeOrg?.logoUrl}
						<img src={workspaces.activeOrg.logoUrl} alt="" class="h-full w-full object-cover" />
					{:else}
						<div
							class="flex h-full w-full items-center justify-center bg-indigo-600 text-sm font-black text-white"
						>
							{workspaces.activeOrg?.name?.[0].toUpperCase() || 'O'}
						</div>
					{/if}
				</div>
				{#if !isCollapsed}
					<div class="min-w-0 flex-1 text-left">
						<div class="mb-1 flex items-center gap-1.5">
							<p
								class="text-[10px] leading-none font-black tracking-widest text-indigo-600 uppercase"
							>
								Organization
							</p>
							<span
								class={`rounded-full px-1.5 py-0.5 text-[8px] font-black tracking-widest uppercase ${workspaces.activeOrg?.planType === 'pro' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : workspaces.activeOrg?.planType === 'enterprise' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}
								>{workspaces.activeOrg?.planType || 'Free'}</span
							>
						</div>
						<p class="truncate text-xs font-bold text-zinc-900 dark:text-zinc-100">
							{workspaces.activeOrg?.name}
						</p>
					</div>
				{/if}
			{/if}

			{#if !isCollapsed}
				<svg
					class={`h-4 w-4 text-zinc-400 transition-all duration-300 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 ${isOpen ? 'rotate-180' : ''}`}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
				>
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			{/if}
		</div>
	</button>

	{#if isOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px]"
			onclick={() => (isOpen = false)}
		></div>

		<div
			class={`absolute ${isCollapsed ? 'bottom-0 left-full ml-2' : 'bottom-full left-0 mb-2 w-full'} ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} border ${ELEVATION.card} animate-in fade-in slide-in-from-bottom-2 z-50 overflow-hidden bg-white/95 backdrop-blur-xl duration-200 dark:bg-zinc-900/95`}
		>
			<div class="p-2">
				<p class="px-3 py-1.5 text-[10px] font-black tracking-widest text-gray-400 uppercase">
					Select Workspace
				</p>

				<!-- Personal -->
				<button
					onclick={() => switchWorkspace('personal')}
					class={`flex w-full items-center gap-3 px-3 py-2 ${RADIUS.small} transition-all ${workspaces.activeId === 'personal' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
				>
					<div
						class={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${workspaces.activeId === 'personal' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
					>
						P
					</div>
					<div class="text-left">
						<p class="mb-1 text-xs leading-none font-bold">Personal Account</p>
						<p class="text-[10px] opacity-70">Individual learning</p>
					</div>
					{#if workspaces.activeId === 'personal'}
						<svg
							class="ml-auto h-4 w-4 text-blue-600"
							fill="none"
							stroke="currentColor"
							stroke-width="3"
							viewBox="0 0 24 24"
						>
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
					{/if}
				</button>

				<div class="my-2 border-t border-gray-100 dark:border-neutral-800"></div>

				{#each workspaces.organizations as org}
					<button
						onclick={() => switchWorkspace(org.id)}
						class={`flex w-full items-center gap-3 px-3 py-2 ${RADIUS.small} transition-all ${workspaces.activeId === org.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
					>
						{#if org.logoUrl}
							<img src={org.logoUrl} alt="" class="h-8 w-8 rounded-lg object-cover" />
						{:else}
							<div
								class={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${workspaces.activeId === org.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}
							>
								{org.name[0].toUpperCase()}
							</div>
						{/if}
						<div class="min-w-0 flex-1 text-left">
							<p class="mb-1 truncate text-xs leading-none font-bold">{org.name}</p>
							<p class="text-[10px] font-black tracking-wider uppercase opacity-70">{org.role}</p>
						</div>
						{#if workspaces.activeId === org.id}
							<svg
								class="ml-auto h-4 w-4 text-indigo-600"
								fill="none"
								stroke="currentColor"
								stroke-width="3"
								viewBox="0 0 24 24"
							>
								<polyline points="20 6 9 17 4 12"></polyline>
							</svg>
						{/if}
					</button>
				{/each}

				<div class="my-2 border-t border-gray-100 dark:border-neutral-800"></div>

				<button
					onclick={createOrganization}
					class={`flex w-full items-center gap-3 px-3 py-2 ${RADIUS.small} text-gray-500 transition-all hover:bg-gray-50`}
				>
					<div
						class="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-100 text-lg"
					>
						+
					</div>
					<div class="text-left">
						<p class="text-xs font-bold">Create Organization</p>
					</div>
				</button>
			</div>
		</div>
	{/if}
</div>
