<script lang="ts">
	import { RADIUS, TEXT, TRANSITION, STATUS } from '$lib/config/design';
	import type { Snippet } from 'svelte';

	interface BadgeProps {
		variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
		size?: 'sm' | 'md';
		class?: string;
		children?: Snippet;
	}

	let { variant = 'default', size = 'md', class: className = '', children }: BadgeProps = $props();

	const variantClasses: Record<string, string> = {
		default: `${STATUS.neutral.bg} ${STATUS.neutral.text}`,
		success: `${STATUS.success.bg} ${STATUS.success.text}`,
		warning: `${STATUS.warning.bg} ${STATUS.warning.text}`,
		error: `${STATUS.error.bg} ${STATUS.error.text}`,
		info: `${STATUS.info.bg} ${STATUS.info.text}`,
		purple: `${STATUS.purple.bg} ${STATUS.purple.text}`
	};

	const sizeClasses: Record<string, string> = {
		sm: 'px-2 py-0.5 text-[10px]',
		md: 'px-2.5 py-1 text-xs'
	};
</script>

<span
	class={`inline-flex items-center font-bold tracking-wider uppercase ${RADIUS.badge} ${TRANSITION.all} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
>
	{@render children?.()}
</span>
