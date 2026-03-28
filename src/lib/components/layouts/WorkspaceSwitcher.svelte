<script lang="ts">
	import { RADIUS, TEXT, COLOR, TRANSITION, ELEVATION } from '$lib/config/design';
	import { invalidateAll, goto } from '$app/navigation';
	import { toast } from '$lib/stores/toast';

	let { workspaces }: { 
		workspaces: { 
			organizations: any[], 
			activeId: string, 
			activeOrg: any 
		} 
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

<div class="relative">
	<button
		onclick={() => (isOpen = !isOpen)}
		class={`flex items-center gap-2 px-3 py-1.5 ${RADIUS.button} bg-gray-50 border border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 hover:bg-gray-100 transition-all group`}
	>
		<div class="flex items-center gap-2 min-w-0">
			{#if workspaces.activeId === 'personal'}
				<div class="h-5 w-5 rounded-md bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">P</div>
				<span class="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">Personal Workspace</span>
			{:else}
				{#if workspaces.activeOrg?.logoUrl}
					<img src={workspaces.activeOrg.logoUrl} alt="" class="h-5 w-5 rounded-md object-cover" />
				{:else}
					<div class="h-5 w-5 rounded-md bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">
						{workspaces.activeOrg?.name?.[0].toUpperCase() || 'O'}
					</div>
				{/if}
				<span class="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">{workspaces.activeOrg?.name}</span>
			{/if}
		</div>
		<svg class={`h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
			<polyline points="6 9 12 15 18 9"></polyline>
		</svg>
	</button>

	{#if isOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="fixed inset-0 z-40" onclick={() => (isOpen = false)}></div>
		
		<div class={`absolute left-0 mt-2 w-64 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} border ${ELEVATION.card} z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200`}>
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
						<div class="text-left">
							<p class="text-xs font-bold leading-none mb-1">{org.name}</p>
							<p class="text-[10px] opacity-70">{org.role.charAt(0).toUpperCase() + org.role.slice(1)}</p>
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
