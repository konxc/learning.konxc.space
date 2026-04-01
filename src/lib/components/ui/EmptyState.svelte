<script lang="ts">
	import { COLOR, RADIUS, TEXT, ELEVATION, SPACING } from '$lib/config/design';
	import type { Snippet } from 'svelte';

	export interface EmptyStateProps {
		icon?: string;
		title: string;
		description?: string;
		action?: Snippet;
		variant?: 'default' | 'centered' | 'inline';
		class?: string;
	}

	let {
		icon = '📭',
		title,
		description,
		action,
		variant = 'default',
		class: className = ''
	}: EmptyStateProps = $props();

	const variantClasses = $derived({
		default: 'border-dashed py-16 text-center',
		centered: 'border-dashed py-20 text-center',
		inline: 'border-dashed py-4 px-2 text-left flex-row items-center gap-3'
	});
</script>

<div
	class={`flex flex-col items-center justify-center rounded-[3rem] border-2 ${COLOR.cardBorder} bg-zinc-50/50 dark:bg-zinc-900/30 ${variantClasses[variant]} ${className}`}
>
	{#if variant !== 'inline'}
		<div class="mb-6 text-7xl">{icon}</div>
	{/if}

	<h3 class={`${TEXT.h3} font-black tracking-tight ${COLOR.textPrimary}`}>
		{title}
	</h3>
	{#if description}
		<p class={`mt-2 max-w-sm ${COLOR.textSecondary}`}>{description}</p>
	{/if}
	{#if action}
		<div class="mt-8">
			{@render action()}
		</div>
	{/if}
</div>
