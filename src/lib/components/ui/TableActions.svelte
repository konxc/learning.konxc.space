<script lang="ts">
	import { RADIUS, COLOR, SPACING, TEXT, STATUS } from '$lib/config/design';

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
		default: `border ${COLOR.cardBorder} ${COLOR.textSecondary} ${COLOR.surfaceHover}`,
		primary: `border-none ${COLOR.accentBg} text-white hover:opacity-90`,
		danger: `border ${STATUS.error.border} ${STATUS.error.text} ${COLOR.surfaceHover}`,
		ghost: `border-none ${COLOR.textMuted} hover:${COLOR.textSecondary} ${COLOR.neutralHover}`
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
