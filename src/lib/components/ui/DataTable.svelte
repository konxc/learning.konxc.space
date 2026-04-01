<script lang="ts">
	import { COLOR, TRANSITION, STATUS, TABLE_ALT } from '$lib/config/design';
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
		<thead class={`sticky top-0 border-b ${COLOR.cardBorder} ${COLOR.neutral} backdrop-blur-sm`}>
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
		<tbody class={`divide-y ${COLOR.cardBorder}`}>
			{#if loading}
				{#each Array(6) as _, i}
					<tr class={`${i % 2 === 0 ? COLOR.surface : TABLE_ALT.row}`}>
						{#each visibleColumns as col}
							<td class={`px-4 py-3 align-middle`}>
								<div class={`h-4 w-3/4 animate-pulse rounded ${STATUS.neutral.bg}`}></div>
							</td>
						{/each}
					</tr>
				{/each}
			{:else if entries.length === 0}
				<tr class={COLOR.surface}>
					<td class={`px-4 py-12 text-center ${COLOR.textSecondary}`} colspan={visibleColumnsCount}>
						{emptyStateMessage}
					</td>
				</tr>
			{:else}
				{#each entries as entry, i}
					<tr
						class={`${TRANSITION.all} ${COLOR.neutralHover} ${
							i % 2 === 0 ? COLOR.surface : TABLE_ALT.row
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
