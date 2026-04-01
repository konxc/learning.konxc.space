<script lang="ts">
	import { RADIUS, COLOR, SPACING, TEXT } from '$lib/config/design';

	export interface TableAction {
		label: string;
		href?: string;
		onClick?: () => void;
		variant?: 'default' | 'primary' | 'danger' | 'ghost';
		icon?: string;
	}

	export interface TableActionsProps {
		actions: TableAction[];
		class?: string;
	}

	let { actions, class: className = '' }: TableActionsProps = $props();

	const variantClasses = $derived({
		default: `border ${COLOR.cardBorder} ${COLOR.textSecondary} hover:bg-zinc-50 dark:hover:bg-zinc-800`,
		primary: `border-none ${COLOR.accentBg} text-white hover:opacity-90`,
		danger: `border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20`,
		ghost: `border-none text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200`
	});
</script>

<div class={`flex items-center gap-2 ${className}`}>
	{#each actions as action}
		{#if action.href}
			<a
				href={action.href}
				class={`inline-flex items-center gap-1.5 ${RADIUS.small} px-2.5 py-1.5 text-xs font-semibold transition-all ${variantClasses[action.variant || 'default']}`}
			>
				{#if action.icon}
					<span class="text-sm">{action.icon}</span>
				{/if}
				{action.label}
			</a>
		{:else}
			<button
				type="button"
				onclick={action.onClick}
				class={`inline-flex items-center gap-1.5 ${RADIUS.small} px-2.5 py-1.5 text-xs font-semibold transition-all ${variantClasses[action.variant || 'default']}`}
			>
				{#if action.icon}
					<span class="text-sm">{action.icon}</span>
				{/if}
				{action.label}
			</button>
		{/if}
	{/each}
</div>
