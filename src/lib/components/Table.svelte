<script lang="ts">
	import { COLOR, TEXT } from '$lib/config/design';

	const {
		columns = [],
		rows = [],
		loading = false,
		emptyText = 'Tidak ada data.'
	} = $props<{
		columns?: Array<{ key: string; label: string; width?: string }>;
		rows?: Array<Record<string, any>>;
		loading?: boolean;
		emptyText?: string;
	}>();
</script>

<div
	class="overflow-auto rounded border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
>
	<table class="w-full border-collapse text-sm">
		<thead
			class="sticky top-0 border-b border-gray-200 bg-gray-50 backdrop-blur-[2px] dark:border-neutral-700 dark:bg-neutral-800/50"
		>
			<tr>
				{#each columns as col}
					<th
						class={`px-3 py-2.5 text-left font-semibold ${COLOR.textPrimary}`}
						style={col.width ? `width:${col.width}` : ''}
					>
						{col.label}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#if loading}
				{#each Array(6) as _}
					<tr class="border-b border-gray-200 dark:border-neutral-800">
						{#each columns as __}
							<td class="px-3 py-2">
								<div
									class="h-3 w-2/3 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700"
								></div>
							</td>
						{/each}
					</tr>
				{/each}
			{:else if rows.length === 0}
				<tr>
					<td class={`px-3 py-8 text-center ${COLOR.textSecondary}`} colspan={columns.length}
						>{emptyText}</td
					>
				</tr>
			{:else}
				{#each rows as r, i}
					<tr
						class={`border-b border-gray-200 dark:border-neutral-800 ${
							i % 2 ? 'bg-gray-50/50 dark:bg-neutral-800/30' : ''
						}`}
					>
						{#each columns as col}
							<td class={`px-3 py-2 align-top ${COLOR.textPrimary}`}>
								{r[col.key]}
							</td>
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
