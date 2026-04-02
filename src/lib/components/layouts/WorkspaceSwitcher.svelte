<script lang="ts">
	import { RADIUS, COLOR, TRANSITION, TEXT, WORKSPACE } from '$lib/config/design';
	import type { Workspace } from '$lib/types/layout';

	interface Props {
		workspaces: Workspace;
		fullWidth?: boolean;
		isCollapsed?: boolean;
		isOpen?: boolean;
		triggerRect?: DOMRect | null;
	}

	let {
		workspaces,
		fullWidth = false,
		isCollapsed = false,
		isOpen = $bindable(false),
		triggerRect = $bindable(null)
	}: Props = $props();
</script>

<div class={`relative ${fullWidth ? 'w-full' : ''}`}>
	<button
		onclick={(e) => {
			const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
			triggerRect = rect;
			isOpen = !isOpen;
		}}
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
					class={`flex shrink-0 items-center justify-center rounded-lg ${WORKSPACE.personal.bg} font-black ${WORKSPACE.personal.text} shadow-md ${isCollapsed ? 'h-8 w-8 text-xs' : 'h-8 w-8 text-sm'}`}
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
							class={`flex h-full w-full items-center justify-center ${WORKSPACE.organization.bg} text-sm font-black ${WORKSPACE.organization.text}`}
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
							{#if workspaces.activeOrg?.brandColor}
								<span
									class="inline-block h-2 w-2 rounded-full"
									style="background-color: {workspaces.activeOrg.brandColor}"
								></span>
							{/if}
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
</div>
