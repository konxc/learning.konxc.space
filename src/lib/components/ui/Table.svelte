<script lang="ts" module>
	export interface Column<T> {
		key: keyof T;
		label: string;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { COLOR, RADIUS, TEXT, TABLE_ALT } from '$lib/config/design';

	interface TableProps {
		columns?: Column<any>[];
		rows?: any[];
		footer?: Snippet;
		children?: Snippet;
	}

	let { columns = $bindable([]), rows = $bindable([]), footer, children }: TableProps = $props();
</script>

<div class="overflow-x-auto">
	<table class={`w-full caption-bottom text-left text-sm ${TEXT.body}`}>
		<thead>
			<tr class={`border-b ${COLOR.surface} text-xs`}>
				{#each columns as c}
					<th class={`px-3 py-2 font-medium ${COLOR.textMuted}`}>{c.label}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each rows as r}
				<tr class={`border-b ${COLOR.cardBorder} ${TABLE_ALT.row}`}>
					{#each columns as c}
						<td class={`px-3 py-2 ${COLOR.textPrimary}`}>{r[c.key]}</td>
					{/each}
				</tr>
			{/each}
			{#if rows.length === 0}
				<tr>
					<td class={`px-3 py-4 text-center ${COLOR.textMuted}`} colspan={columns.length}
						>No data</td
					>
				</tr>
			{/if}
		</tbody>
	</table>
	{@render footer?.()}
	{@render children?.()}
</div>
