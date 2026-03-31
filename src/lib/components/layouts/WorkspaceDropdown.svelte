<script lang="ts">
	import { RADIUS, TEXT, COLOR, ELEVATION } from '$lib/config/design';
	import { invalidateAll, goto } from '$app/navigation';
	import { toast } from '$lib/stores/toastStore';
	import { fly } from 'svelte/transition';

	let {
		workspaces,
		triggerRect,
		isCollapsed = false,
		isOpen = $bindable(false)
	}: {
		workspaces: {
			organizations: any[];
			activeId: string;
			activeOrg: any;
		};
		triggerRect: DOMRect;
		isCollapsed?: boolean;
		isOpen?: boolean;
	} = $props();

	const dropdownStyle = $derived(
		isCollapsed
			? `left: ${triggerRect.right + 8}px; bottom: ${window.innerHeight - triggerRect.bottom}px;`
			: `left: ${triggerRect.left}px; bottom: ${window.innerHeight - triggerRect.top + 8}px; width: ${triggerRect.width}px;`
	);

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
				toast.success(`Berpindah ke ruang kerja ${id === 'personal' ? 'Personal' : 'Organisasi'}`);
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

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class={`fixed z-[52] ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} border ${ELEVATION.card} overflow-hidden bg-white/95 backdrop-blur-xl dark:bg-zinc-900/95`}
	style={dropdownStyle}
	in:fly={{ y: 8, duration: 200, opacity: 0 }}
	out:fly={{ y: 8, duration: 150, opacity: 0 }}
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
