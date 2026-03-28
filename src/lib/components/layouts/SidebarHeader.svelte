<script lang="ts">
	import { page } from '$app/stores';
	import { COLOR, RADIUS, TRANSITION, TEXT, GRADIENT } from '$lib/config/design';

	let {
		workspaces
	}: {
		workspaces: {
			organizations: any[];
			activeId: string;
			activeOrg: any;
		};
	} = $props();

	const isOrg = $derived(workspaces.activeId !== 'personal');
	const activeName = $derived(isOrg ? workspaces.activeOrg?.name : 'Personal Workspace');
	const activeInitial = $derived(isOrg ? workspaces.activeOrg?.name?.[0] || 'O' : 'P');
</script>

<div
	class={`group relative mb-4 overflow-hidden border-b border-zinc-200/50 px-5 py-5 transition-all duration-500 dark:border-zinc-800/50 ${workspaces.activeId === 'personal' ? 'bg-blue-50/20 dark:bg-blue-900/10' : 'bg-indigo-50/20 dark:bg-indigo-900/10'}`}
>
	<!-- Glassmorphism Background Decoration -->
	<div
		class="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-blue-500/5 blur-2xl transition-all duration-700 group-hover:bg-blue-500/10"
	></div>

	<div class="relative z-10 flex items-center gap-4">
		<div
			class={`h-11 w-11 shrink-0 ${RADIUS.small} flex items-center justify-center text-sm font-black text-white shadow-lg ring-2 ring-white dark:ring-zinc-800 ${workspaces.activeId === 'personal' ? 'bg-blue-600' : 'bg-indigo-600'}`}
		>
			{#if isOrg && workspaces.activeOrg?.logoUrl}
				<img
					src={workspaces.activeOrg.logoUrl}
					alt=""
					class="rounded-inherit h-full w-full object-cover"
				/>
			{:else}
				<span class="drop-shadow-md">{activeInitial}</span>
			{/if}
		</div>
		<div class="min-w-0 flex-1 space-y-1.5">
			<div class="flex items-center gap-2">
				<p
					class={`text-[10px] leading-none font-black tracking-[0.15em] uppercase ${workspaces.activeId === 'personal' ? 'text-blue-600' : 'text-indigo-600'}`}
				>
					{isOrg ? 'Organization' : 'Account'}
				</p>
				{#if isOrg && workspaces.activeOrg?.planType}
					<div class="flex items-center">
						<span
							class={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[8px] font-black tracking-widest uppercase shadow-sm ${workspaces.activeOrg.planType === 'pro' ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white' : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}
						>
							{#if workspaces.activeOrg.planType === 'pro'}
								<span class="text-[10px]">✨</span>
							{/if}
							{workspaces.activeOrg.planType}
						</span>
					</div>
				{/if}
			</div>
			<h3
				class="truncate text-[0.875rem] leading-none font-black tracking-tight text-zinc-900 dark:text-zinc-100"
			>
				{activeName}
			</h3>
		</div>
	</div>
</div>
