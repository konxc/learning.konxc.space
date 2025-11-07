<script lang="ts">
	import { COLOR, RADIUS, TEXT, TRANSITION } from '$lib/config/design';
	import { onMount } from 'svelte';
	import ToggleButton from '$lib/components/ui/ToggleButton.svelte';
	import type { TableColumn } from '$lib/types/table';

	let {
		columns,
		storageKey,
		onVisibilityChange
	}: {
		columns: TableColumn[];
		storageKey: string;
		onVisibilityChange?: (visibleColumns: Set<string>) => void;
	} = $props();

	let isOpen = $state(false);
	let visibleColumns = $state<Set<string>>(new Set());

	// Expose method for parent component
	export function isColumnVisible(key: string): boolean {
		return visibleColumns.has(key);
	}

	// Load from localStorage on mount
	onMount(() => {
		try {
			const saved = localStorage.getItem(storageKey);
			if (saved) {
				const parsed = JSON.parse(saved);
				visibleColumns = new Set(parsed);
			} else {
				// Default: semua kolom visible
				visibleColumns = new Set(columns.map((col) => col.key));
			}
			// Notify parent on initial load
			onVisibilityChange?.(visibleColumns);
		} catch (error) {
			console.error('Error loading column visibility:', error);
			visibleColumns = new Set(columns.map((col) => col.key));
			onVisibilityChange?.(visibleColumns);
		}
	});

	// Save to localStorage whenever visibleColumns changes
	$effect(() => {
		if (visibleColumns.size > 0) {
			try {
				localStorage.setItem(storageKey, JSON.stringify(Array.from(visibleColumns)));
				// Notify parent component
				onVisibilityChange?.(visibleColumns);
			} catch (error) {
				console.error('Error saving column visibility:', error);
			}
		}
	});

	function toggleColumn(key: string) {
		visibleColumns = new Set(visibleColumns);
		if (visibleColumns.has(key)) {
			visibleColumns.delete(key);
		} else {
			visibleColumns.add(key);
		}
		// Notify parent immediately
		onVisibilityChange?.(visibleColumns);
	}

	// Ensure required columns are always visible
	$effect(() => {
		columns.forEach((col) => {
			if (col.required && !visibleColumns.has(col.key)) {
				visibleColumns = new Set(visibleColumns);
				visibleColumns.add(col.key);
			}
		});
	});
</script>

<div class="relative">
	<ToggleButton
		bind:isOpen
		label="Kolom"
		ariaLabel="Filter kolom"
		badge="{visibleColumns.size}/{columns.length}"
		showArrow={true}
		fullWidth={false}
	>
		<span>👁️</span>
	</ToggleButton>

	{#if isOpen}
		<!-- Dropdown menu -->
		<div
			class={`absolute top-full right-0 z-50 mt-2 min-w-[200px] ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} shadow-lg`}
			role="menu"
		>
			<div class={`p-2 ${COLOR.textSecondary} ${TEXT.small} font-medium`}>Tampilkan Kolom:</div>
			<div class="border-t border-gray-200 dark:border-neutral-700">
				{#each columns as col}
					<label
						class={`flex items-center gap-3 px-3 py-2 ${TRANSITION.all} hover:bg-gray-100 dark:hover:bg-neutral-800 ${
							col.required ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
						}`}
					>
						<input
							type="checkbox"
							checked={isColumnVisible(col.key)}
							disabled={col.required}
							onchange={() => {
								if (!col.required) {
									toggleColumn(col.key);
								}
							}}
							class="h-4 w-4 shrink-0 cursor-pointer rounded border border-gray-400 bg-white text-blue-600 transition-all checked:border-blue-600 checked:bg-blue-600 hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-500 dark:bg-neutral-800 dark:checked:border-blue-500 dark:checked:bg-blue-500 dark:hover:border-blue-400 dark:focus:ring-blue-400"
						/>
						<span class={`${TEXT.body} ${COLOR.textPrimary} flex-1`}>{col.label}</span>
						{#if col.required}
							<span class={`${TEXT.xsmall} ${COLOR.textSecondary}`}>Required</span>
						{/if}
					</label>
				{/each}
			</div>
		</div>
	{/if}
</div>

<!-- Click outside to close -->
{#if isOpen}
	<div
		class="fixed inset-0 z-40"
		role="button"
		tabindex="-1"
		onclick={() => {
			isOpen = false;
		}}
		onkeydown={(e) => {
			if (e.key === 'Escape') {
				isOpen = false;
			}
		}}
		aria-label="Close column filter"
	></div>
{/if}
