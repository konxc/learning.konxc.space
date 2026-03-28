<script lang="ts">
	import { page } from '$app/stores';
	import { COLOR, RADIUS, TRANSITION, TEXT } from '$lib/config/design';

	let { workspaces }: { 
		workspaces: { 
			organizations: any[], 
			activeId: string, 
			activeOrg: any 
		} 
	} = $props();

	const isOrg = $derived(workspaces.activeId !== 'personal');
	const activeName = $derived(isOrg ? workspaces.activeOrg?.name : 'Personal Workspace');
	const activeInital = $derived(isOrg ? (workspaces.activeOrg?.name?.[0] || 'O') : 'P');
</script>

<div class={`px-4 py-4 mb-2 border-b border-gray-100 dark:border-neutral-800 transition-all duration-300 ${workspaces.activeId === 'personal' ? 'bg-blue-50/30' : 'bg-indigo-50/30'}`}>
	<div class="flex items-center gap-3">
		<div class={`h-10 w-10 shrink-0 ${RADIUS.small} flex items-center justify-center text-sm font-black text-white shadow-sm ${workspaces.activeId === 'personal' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
			{#if isOrg && workspaces.activeOrg?.logoUrl}
				<img src={workspaces.activeOrg.logoUrl} alt="" class="h-full w-full object-cover rounded-inherit" />
			{:else}
				{activeInital}
			{/if}
		</div>
		<div class="min-w-0 flex-1">
			<div class="flex items-center gap-1.5 mb-1.5">
				<p class={`text-[10px] font-black uppercase tracking-widest leading-none ${workspaces.activeId === 'personal' ? 'text-blue-600' : 'text-indigo-600'}`}>
					Working in
				</p>
				{#if isOrg && workspaces.activeOrg?.planType}
					<span class={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${workspaces.activeOrg.planType === 'pro' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-gray-200 text-gray-600 dark:bg-neutral-800 dark:text-gray-400'}`}>
						{workspaces.activeOrg.planType}
					</span>
				{/if}
			</div>
			<h3 class="text-sm font-bold text-gray-900 dark:text-gray-100 truncate leading-none">
				{activeName}
			</h3>
		</div>
	</div>
</div>
