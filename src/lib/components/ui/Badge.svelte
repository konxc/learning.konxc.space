<script lang="ts">
	import { RADIUS, TEXT, TRANSITION } from '$lib/config/design';
	import type { Snippet } from 'svelte';

	interface BadgeProps {
		variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
		size?: 'sm' | 'md';
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'default',
		size = 'md',
		class: className = '',
		children
	}: BadgeProps = $props();

	const variantClasses: Record<string, string> = {
		default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
		success: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
		warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
		error: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
		info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
		purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400'
	};

	const sizeClasses: Record<string, string> = {
		sm: 'px-2 py-0.5 text-[10px]',
		md: 'px-2.5 py-1 text-xs'
	};
</script>

<span
	class={`inline-flex items-center font-bold uppercase tracking-wider ${RADIUS.badge} ${TRANSITION.all} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
>
	{@render children?.()}
</span>
