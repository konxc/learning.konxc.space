<script lang="ts">
	import { RADIUS, SPACING, TEXT, TRANSITION, COLOR } from '$lib/config/design';
	import type { Snippet } from 'svelte';

	interface ButtonProps {
		variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
		size?: 'sm' | 'md' | 'lg';
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		type = 'button',
		disabled = false,
		class: className = '',
		children
	}: ButtonProps = $props();

	const variantClasses: Record<string, string> = {
		primary: `${COLOR.accentBg} text-white ${COLOR.accentHover} focus-visible:ring-blue-600/70`,
		secondary: `${COLOR.neutral} ${COLOR.textPrimary} ${COLOR.neutralHover} focus-visible:ring-gray-600/70`,
		ghost: `bg-transparent ${COLOR.textPrimary} hover:bg-gray-100/80 dark:hover:bg-neutral-800/60 focus-visible:ring-gray-600/70`,
		danger: `bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600/70`,
		success: `bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-600/70`,
		outline: `border-2 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-400 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800 focus-visible:ring-gray-600/70`
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
>
	{@render children?.()}
</button>
