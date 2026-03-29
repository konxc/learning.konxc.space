<script lang="ts">
	import { COLOR, RADIUS, TEXT, ELEVATION } from '$lib/config/design';
	import type { Snippet } from 'svelte';

	let {
		icon = '📭',
		title,
		description,
		action
	}: {
		icon?: string;
		title: string;
		description?: string;
		action?: Snippet;
	} = $props();
</script>

<div
	class={`flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-zinc-200 bg-zinc-50/50 py-16 text-center dark:border-zinc-800 dark:bg-zinc-900/30`}
>
	<div class="mb-6 text-7xl">{icon}</div>
	<h3 class={`${TEXT.h3} font-black tracking-tight text-neutral-900 dark:text-white`}>{title}</h3>
	{#if description}
		<p class={`mt-2 max-w-sm ${COLOR.textSecondary}`}>{description}</p>
	{/if}
	{#if action}
		<div class="mt-8">
			{@render action()}
		</div>
	{/if}
</div>
