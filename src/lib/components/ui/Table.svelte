<script lang="ts" module>
	export interface Column<T> {
		key: keyof T;
		label: string;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		columns = $bindable([]),
		rows = $bindable([]),
		footer,
		children
	} = $props<{
		columns?: Column<any>[];
		rows?: any[];
		footer?: Snippet;
		children?: Snippet;
	}>();
</script>

<div class="overflow-x-auto">
	<table class="w-full caption-bottom text-left text-sm">
		<thead>
			<tr class="border-b bg-neutral-50 text-xs text-neutral-600">
				{#each columns as c}
					<th class="px-3 py-2 font-medium">{c.label}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each rows as r}
				<tr class="border-b hover:bg-neutral-50">
					{#each columns as c}
						<td class="px-3 py-2">{r[c.key]}</td>
					{/each}
				</tr>
			{/each}
			{#if rows.length === 0}
				<tr>
					<td class="px-3 py-4 text-center text-neutral-500" colspan={columns.length}>No data</td>
				</tr>
			{/if}
		</tbody>
	</table>
	{@render footer?.()}
	{@render children?.()}
</div>
