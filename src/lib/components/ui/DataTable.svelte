<script lang="ts">
	import { COLOR, TRANSITION } from '$lib/config/design';
	import type { Snippet } from 'svelte';
	import type { TableColumn } from '$lib/types/table';

	interface DataTableProps<T = any> {
		entries: T[];
		columns: TableColumn[];
		columnVisibility: Record<string, boolean>;
		isColumnVisible: (key: string) => boolean;
		emptyStateMessage?: string;
		loading?: boolean;
		cell?: Snippet<[key: string, entry: T, index: number]>;
	}

	let {
		entries,
		columns,
		columnVisibility,
		isColumnVisible,
		emptyStateMessage = 'Tidak ada data yang sesuai dengan filter.',
		loading = false,
		cell
	}: DataTableProps = $props();

	// Performance optimization: compute visible columns once
	const visibleColumns = $derived(columns.filter((col) => isColumnVisible(col.key)));
	const visibleColumnsCount = $derived(visibleColumns.length);
</script>

<!-- Table without card wrapper -->
<div class="overflow-auto rounded-lg">
	<table class="w-full border-collapse text-sm">
		<thead
			class="sticky top-0 border-b border-gray-200/60 bg-gray-100 backdrop-blur-sm dark:border-neutral-700/60 dark:bg-neutral-800"
		>
			<tr>
				{#each visibleColumns as col, index}
					<th
						class={`px-4 py-3 font-semibold ${COLOR.textPrimary} ${
							col.align === 'center'
								? 'text-center'
								: col.align === 'right'
									? 'text-right'
									: 'text-left'
						} ${index === 0 ? 'first:rounded-tl-lg' : ''} ${
							index === visibleColumnsCount - 1 ? 'last:rounded-tr-lg' : ''
						}`}
						style={col.width ? `width:${col.width}` : ''}
					>
						{col.label}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-200/40 dark:divide-neutral-700/40">
			{#if loading}
				{#each Array(6) as _, i}
					<tr
						class={`${
							i % 2 === 0 ? 'bg-white dark:bg-neutral-900' : 'bg-gray-50 dark:bg-neutral-800/60'
						}`}
					>
						{#each visibleColumns as col}
							<td class={`px-4 py-3 align-middle`}>
								<div class="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-neutral-700"></div>
							</td>
						{/each}
					</tr>
				{/each}
			{:else if entries.length === 0}
				<tr class="bg-white dark:bg-neutral-900">
					<td class={`px-4 py-12 text-center ${COLOR.textSecondary}`} colspan={visibleColumnsCount}>
						{emptyStateMessage}
					</td>
				</tr>
			{:else}
				{#each entries as entry, i}
					<tr
						class={`${TRANSITION.all} hover:bg-gray-100 dark:hover:bg-neutral-800/80 ${
							i % 2 === 0 ? 'bg-white dark:bg-neutral-900' : 'bg-gray-50 dark:bg-neutral-800/60'
						}`}
					>
						{#each visibleColumns as col}
							<td
								class={`px-4 py-3 align-middle ${COLOR.textPrimary} ${
									col.align === 'center'
										? 'text-center'
										: col.align === 'right'
											? 'text-right'
											: 'text-left'
								}`}
							>
								{#if cell}
									{@render cell(col.key, entry, i)}
								{:else}
									{entry[col.key] ?? '—'}
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
