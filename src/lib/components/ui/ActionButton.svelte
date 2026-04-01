<script lang="ts">
	import { RADIUS, COLOR, TRANSITION, TEXT, FOCUS } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import type { Snippet } from 'svelte';

	interface ActionButtonProps {
		variant?: 'primary' | 'danger' | 'neutral' | 'accent';
		icon?: string;
		label: string;
		href?: string;
		onclick?: () => void;
		title?: string;
		class?: string;
	}

	let {
		variant = 'primary',
		icon,
		label,
		href,
		onclick,
		title,
		class: className = ''
	}: ActionButtonProps = $props();

	const variantClasses: Record<string, string> = {
		primary: `border-zinc-200 ${COLOR.surface} hover:border-blue-500/50 hover:bg-blue-50/50 hover:text-blue-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-blue-500/50 dark:hover:bg-blue-900/30 dark:hover:text-blue-400`,
		danger: `border-red-200 ${COLOR.surface} text-red-600 hover:border-red-500/50 hover:bg-red-50/50 hover:text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:border-red-500/50 dark:hover:bg-red-900/30 dark:hover:text-red-300`,
		neutral: `border-zinc-200 ${COLOR.surface} hover:border-purple-500/50 hover:bg-purple-50/50 hover:text-purple-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-purple-500/50 dark:hover:bg-purple-900/30 dark:hover:text-purple-400`,
		accent: `border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-800/50 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50`
	};

	const cls = `inline-flex items-center gap-1.5 ${RADIUS.small} border px-2.5 py-1.5 text-xs font-semibold ${COLOR.textSecondary} ${TRANSITION.all} ${variantClasses[variant]} ${className}`;
</script>

{#if href}
	<a {href} class={cls} {title}>
		{#if icon}
			<Icon name={icon} size={14} />
		{/if}
		{label}
	</a>
{:else}
	<button type="button" class={cls} {onclick} {title}>
		{#if icon}
			<Icon name={icon} size={14} />
		{/if}
		{label}
	</button>
{/if}
