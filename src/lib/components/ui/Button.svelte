<script lang="ts">
	import { RADIUS, SPACING, TEXT, TRANSITION, COLOR } from '$lib/config/design';
	import type { Snippet } from 'svelte';

	const {
		variant = 'primary',
		type = 'button',
		disabled = false,
		children
	} = $props<{
		variant?: 'primary' | 'secondary' | 'ghost';
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		children?: Snippet;
	}>();

	const variantClasses: Record<string, string> = {
		// WCAG AA: blue-600 on white with white text has 4.81:1 contrast (sufficient for buttons)
		primary: `${COLOR.accentBg} text-white ${COLOR.accentHover} focus-visible:ring-blue-600/70`,
		// WCAG AA: gray-50 on white with gray-900 text has sufficient contrast
		secondary: `${COLOR.neutral} ${COLOR.textPrimary} ${COLOR.neutralHover} focus-visible:ring-gray-600/70`,
		// Ghost buttons: ensure text has good contrast
		ghost: `bg-transparent ${COLOR.textPrimary} hover:bg-gray-100/80 dark:hover:bg-neutral-800/60 focus-visible:ring-gray-600/70`
	};
	const cls = variantClasses[variant] || variantClasses.primary;
</script>

<button
	class={`inline-flex items-center gap-2 ${RADIUS.button} ${SPACING.button} ${TEXT.button} ${TRANSITION.colors} ${cls} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
	{type}
	{disabled}
>
	{@render children?.()}
</button>
