<script lang="ts">
	const { messages = [] } = $props<{
		messages?: { id: string; type: 'success' | 'error' | 'info'; text: string }[];
	}>();
</script>

<div aria-live="polite" class="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2 md:bottom-6 md:right-6">
	{#each messages as m (m.id)}
		<div
			class="pointer-events-auto w-full max-w-md rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
			role="status"
		>
			<div class="flex items-start gap-3">
				{#if m.type === 'success'}
					<span class="text-green-600 dark:text-green-400">✓</span>
				{:else if m.type === 'error'}
					<span class="text-red-600 dark:text-red-400">✗</span>
				{:else if m.type === 'info'}
					<span class="text-blue-600 dark:text-blue-400">ℹ</span>
				{/if}
				<span class="flex-1 text-gray-900 dark:text-gray-100">{m.text}</span>
			</div>
		</div>
	{/each}
</div>
