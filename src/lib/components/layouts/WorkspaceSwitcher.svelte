<script lang="ts">
	import { RADIUS, TEXT, COLOR, TRANSITION, ELEVATION } from '$lib/config/design';
	import { invalidateAll, goto } from '$app/navigation';
	import { toast } from '$lib/stores/toast';

	let { workspaces, fullWidth = false, isCollapsed = false }: { 
		workspaces: { 
			organizations: any[], 
			activeId: string, 
			activeOrg: any 
		},
		fullWidth?: boolean,
		isCollapsed?: boolean
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
				toast.error('Failed to switch workspace');
			}
		} catch (e) {
			toast.error('An error occurred');
		}
	}

	function createOrganization() {
		isOpen = false;
		goto('/app/settings/organization');
	}
</script>

<div class={`relative ${fullWidth ? 'w-full' : ''}`}>
	<button
		onclick={() => (isOpen = !isOpen)}
		class={`flex items-center gap-3 ${isCollapsed ? 'justify-center p-2' : 'p-2.5 w-full'} ${RADIUS.card} bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800/60 transition-all group relative overflow-hidden active:scale-[0.98]`}
		aria-expanded={isOpen}
		aria-haspopup="listbox"
	>
		<!-- Interaction Surface -->
		<div class="absolute inset-0 bg-linear-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all"></div>

		<div class="flex items-center gap-3 min-w-0 relative z-10 w-full">
			{#if workspaces.activeId === 'personal'}
				<div class={`flex items-center justify-center shrink-0 rounded-lg bg-blue-600 text-white font-black shadow-md ${isCollapsed ? 'h-8 w-8 text-xs' : 'h-8 w-8 text-sm'}`}>P</div>
				{#if !isCollapsed}
					<div class="flex-1 text-left min-w-0">
						<p class="text-[10px] font-black uppercase tracking-widest text-blue-600 leading-none mb-1">Personal</p>
						<p class="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">Account</p>
					</div>
				{/if}
			{:else}
				<div class={`shrink-0 rounded-lg overflow-hidden shadow-md ring-1 ring-black/5 dark:ring-white/10 ${isCollapsed ? 'h-8 w-8' : 'h-8 w-8'}`}>
					{#if workspaces.activeOrg?.logoUrl}
						<img src={workspaces.activeOrg.logoUrl} alt="" class="h-full w-full object-cover" />
					{:else}
						<div class="h-full w-full bg-indigo-600 flex items-center justify-center text-sm text-white font-black">
							{workspaces.activeOrg?.name?.[0].toUpperCase() || 'O'}
						</div>
					{/if}
				</div>
				{#if !isCollapsed}
					<div class="flex-1 text-left min-w-0">
						<p class="text-[10px] font-black uppercase tracking-widest text-indigo-600 leading-none mb-1">Organization</p>
						<p class="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{workspaces.activeOrg?.name}</p>
					</div>
				{/if}
			{/if}
			
			{#if !isCollapsed}
				<svg class={`h-4 w-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-200 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			{/if}
		</div>
	</button>

	{#if isOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px]" onclick={() => (isOpen = false)}></div>
		
		<div class={`absolute ${isCollapsed ? 'left-full ml-2 bottom-0' : 'left-0 bottom-full mb-2 w-full'} ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} border ${ELEVATION.card} z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 backdrop-blur-xl bg-white/95 dark:bg-zinc-900/95`}>
			<div class="p-2">
				<p class="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Select Workspace</p>
				
				<!-- Personal -->
				<button
					onclick={() => switchWorkspace('personal')}
					class={`w-full flex items-center gap-3 px-3 py-2 ${RADIUS.small} transition-all ${workspaces.activeId === 'personal' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-600'}`}
				>
					<div class={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold ${workspaces.activeId === 'personal' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>P</div>
					<div class="text-left">
						<p class="text-xs font-bold leading-none mb-1">Personal Account</p>
						<p class="text-[10px] opacity-70">Individual learning</p>
					</div>
					{#if workspaces.activeId === 'personal'}
						<svg class="ml-auto h-4 w-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
					{/if}
				</button>

				<div class="my-2 border-t border-gray-100 dark:border-neutral-800"></div>

				{#each workspaces.organizations as org}
					<button
						onclick={() => switchWorkspace(org.id)}
						class={`w-full flex items-center gap-3 px-3 py-2 ${RADIUS.small} transition-all ${workspaces.activeId === org.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-600'}`}
					>
						{#if org.logoUrl}
							<img src={org.logoUrl} alt="" class="h-8 w-8 rounded-lg object-cover" />
						{:else}
							<div class={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold ${workspaces.activeId === org.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
								{org.name[0].toUpperCase()}
							</div>
						{/if}
						<div class="text-left flex-1 min-w-0">
							<p class="text-xs font-bold leading-none mb-1 truncate">{org.name}</p>
							<p class="text-[10px] opacity-70 uppercase tracking-wider font-black">{org.role}</p>
						</div>
						{#if workspaces.activeId === org.id}
							<svg class="ml-auto h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
								<polyline points="20 6 9 17 4 12"></polyline>
							</svg>
						{/if}
					</button>
				{/each}

				<div class="my-2 border-t border-gray-100 dark:border-neutral-800"></div>

			<button 
				onclick={createOrganization}
				class={`w-full flex items-center gap-3 px-3 py-2 ${RADIUS.small} hover:bg-gray-50 text-gray-500 transition-all`}>
				<div class="h-8 w-8 rounded-lg bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-lg">+</div>
				<div class="text-left">
					<p class="text-xs font-bold">Create Organization</p>
				</div>
			</button>
			</div>
		</div>
	{/if}
</div>
