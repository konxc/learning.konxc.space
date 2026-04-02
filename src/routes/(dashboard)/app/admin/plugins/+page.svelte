<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toast } from '$lib/stores/toastStore';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import StatCard from '$lib/components/ui/StatCard.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, SPACING } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	let togglingId = $state<string | null>(null);

	// Group plugins by type
	const pluginsByType = $derived(() => {
		const groups: Record<string, typeof data.plugins> = {};
		for (const plugin of data.plugins || []) {
			const type = plugin.type;
			if (!groups[type]) groups[type] = [];
			groups[type].push(plugin);
		}
		return groups;
	});
</script>

<svelte:head>
	<title>Plugin Management - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Plugin Management"
		description="Manage built-in plugins and their configurations"
	/>

	<!-- Plugin Stats -->
	<div class="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
		<StatCard value={data.plugins?.length || 0} label="Total Plugins" variant="accent" />
		<StatCard
			value={data.plugins?.filter((p) => p.isActive).length || 0}
			label="Active"
			variant="success"
		/>
		<StatCard value={Object.keys(pluginsByType()).length} label="Categories" variant="warning" />
		<StatCard value={8} label="Built-in" variant="accent" />
	</div>

	<!-- Plugin List by Type -->
	{#each Object.entries(pluginsByType()) as [type, plugins]}
		<PageSection>
			<div class="mb-4 flex items-center gap-2">
				<span class="text-xl">{plugins[0]?.typeInfo?.icon || '📦'}</span>
				<h2 class={TEXT.h2}>{plugins[0]?.typeInfo?.label || type} Plugins</h2>
				<span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">
					{plugins.length}
				</span>
			</div>

			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each plugins as plugin}
					<div
						class={`${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${ELEVATION.base} p-5 transition-all hover:${ELEVATION.cardHover}`}
					>
						<div class="mb-3 flex items-start justify-between">
							<div class="flex items-center gap-3">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-2xl"
								>
									{plugin.icon}
								</div>
								<div>
									<h3 class="font-bold text-gray-900">{plugin.name}</h3>
									<p class="text-xs text-gray-500">v{plugin.version}</p>
								</div>
							</div>
							<span
								class={`rounded-full px-2 py-0.5 text-[10px] font-bold ${plugin.typeInfo?.color || 'bg-gray-100 text-gray-600'}`}
							>
								{plugin.typeInfo?.label || type}
							</span>
						</div>

						<p class="mb-4 text-sm leading-relaxed text-gray-600">
							{plugin.description}
						</p>

						<div class="flex items-center justify-between border-t border-gray-100 pt-3">
							<div class="flex items-center gap-2">
								<span
									class={`inline-flex h-2 w-2 rounded-full ${plugin.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
								></span>
								<span class="text-xs font-medium text-gray-500">
									{plugin.isActive ? 'Active' : 'Inactive'}
								</span>
							</div>

							<form
								method="POST"
								action="?/toggle"
								use:enhance={() => {
									togglingId = plugin.id;
									return async ({ result }) => {
										togglingId = null;
										if (
											result.type === 'success' &&
											'data' in result &&
											result.data &&
											typeof result.data === 'object' &&
											'message' in result.data
										) {
											toast.success(result.data.message as string);
											await invalidateAll();
										} else {
											toast.error('Failed to update plugin');
										}
									};
								}}
							>
								<input type="hidden" name="pluginId" value={plugin.id} />
								<input type="hidden" name="isActive" value={(!plugin.isActive).toString()} />
								<button
									type="submit"
									disabled={togglingId === plugin.id}
									class={`rounded px-3 py-1 text-xs font-bold tracking-wider uppercase transition-colors ${
										plugin.isActive
											? 'bg-red-100 text-red-600 hover:bg-red-200'
											: 'bg-green-100 text-green-600 hover:bg-green-200'
									} disabled:opacity-50`}
								>
									{togglingId === plugin.id ? '...' : plugin.isActive ? 'Disable' : 'Enable'}
								</button>
							</form>

							{#if plugin.dependencies.length > 0}
								<span class="text-xs text-gray-400">
									Depends on: {plugin.dependencies.join(', ')}
								</span>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</PageSection>
	{/each}

	{#if !data.plugins || data.plugins.length === 0}
		<PageSection>
			<div class="py-12 text-center">
				<p class="mb-4 text-4xl">📦</p>
				<p class={COLOR.textSecondary}>No plugins found</p>
			</div>
		</PageSection>
	{/if}
</PageWrapper>
