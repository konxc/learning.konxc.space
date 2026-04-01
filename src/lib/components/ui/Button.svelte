<script lang="ts">
	import { RADIUS, SPACING, TEXT, TRANSITION, COLOR, FOCUS } from '$lib/config/design';
	import type { Snippet } from 'svelte';

	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface ButtonProps {
		variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline' | 'neutral';
		size?: 'sm' | 'md' | 'lg';
		type?: HTMLButtonAttributes['type'];
		disabled?: boolean;
		class?: string;
		onclick?: HTMLButtonAttributes['onclick'];
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		type = 'button',
		disabled = false,
		class: className = '',
		onclick,
		children
	}: ButtonProps = $props();

	const variantClasses: Record<string, string> = {
		primary: `${COLOR.accentBg} text-white ${COLOR.accentHover} ${FOCUS.accent}`,
		secondary: `${COLOR.neutral} ${COLOR.textPrimary} ${COLOR.neutralHover} ${FOCUS.neutral}`,
		ghost: `bg-transparent ${COLOR.textPrimary} hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 ${FOCUS.neutral}`,
		danger: `bg-red-600 text-white hover:bg-red-700 ${FOCUS.error}`,
		success: `bg-green-600 text-white hover:bg-green-700 ${FOCUS.success}`,
		outline: `border-2 border-zinc-300 bg-transparent text-zinc-700 hover:bg-zinc-50 hover:border-zinc-400 dark:text-zinc-300 dark:border-zinc-600 dark:hover:bg-zinc-800 ${FOCUS.neutral}`,
		neutral: `${COLOR.neutral} ${COLOR.textPrimary} ${COLOR.neutralHover} ${FOCUS.neutral}`
	};

	const sizeClasses: Record<string, string> = {
		sm: 'px-3 py-1.5 text-xs',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};

	const cls = `${sizeClasses[size]} ${variantClasses[variant] || variantClasses.primary}`;
</script>

<button
	class={`inline-flex items-center gap-2 ${RADIUS.button} ${TEXT.button} ${TRANSITION.colors} ${cls} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}
	{type}
	{disabled}
	{onclick}
>
	{@render children?.()}
</button>
