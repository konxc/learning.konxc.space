<script lang="ts">
	import { TEXT, COLOR } from '$lib/config/design';
	import { setPageMetadata, getPageMetadata } from '$lib/stores/pageMetadata';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	let {
		title,
		description,
		children,
		showInContent = false
	}: {
		title: string;
		description?: string;
		children?: Snippet;
		showInContent?: boolean; // Jika true, tetap tampilkan di konten (fallback)
	} = $props();

	// Set page metadata untuk ditampilkan di header
	let pageMetadata = $state<ReturnType<typeof getPageMetadata> | null>(null);
	try {
		pageMetadata = getPageMetadata();
	} catch (e) {
		// Context belum tersedia (tidak dalam AppShell)
		// Akan tetap tampil di konten
	}

	// Update metadata jika title/description berubah
	$effect(() => {
		if (pageMetadata) {
			pageMetadata.set({ title, description });
		}
	});
</script>

{#if showInContent || !pageMetadata}
	<!-- Fallback: Tampilkan di konten jika context tidak tersedia atau showInContent=true -->
	<div class="mb-3 flex items-start justify-between gap-4">
		<div class="flex-1">
			<h1 class={`${TEXT.h1} ${COLOR.textPrimary} mb-2`}>{title}</h1>
			{#if description}
				<p class={`${TEXT.secondary}`}>{description}</p>
			{/if}
		</div>
		{#if children}
			<div>
				{@render children?.()}
			</div>
		{/if}
	</div>
{:else if children}
	<!-- Hanya render children jika ada dan metadata sudah di-set ke header -->
	<div class="mb-3 flex items-end justify-end gap-4">
		{@render children?.()}
	</div>
{/if}
