<script lang="ts">
	import { RADIUS, TEXT } from '$lib/config/design';
	import { toast } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';

	export type StatusType = 'approved' | 'pending' | 'rejected' | 'active' | 'inactive' | 'published' | 'draft' | 'archived' | 'success' | 'error' | 'warning' | 'info' | 'default';

	export interface StatusConfig {
		text: string;
		color: string;
		icon?: string;
		bgColor?: string;
		textColor?: string;
		borderColor?: string;
	}

	const defaultConfig: Record<StatusType, StatusConfig> = {
		approved: { text: 'Approved', color: 'emerald', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30', textColor: 'text-emerald-700 dark:text-emerald-400', borderColor: 'border-emerald-200/50 dark:border-emerald-800/50' },
		pending: { text: 'Pending', color: 'amber', bgColor: 'bg-amber-50 dark:bg-amber-950/30', textColor: 'text-amber-700 dark:text-amber-400', borderColor: 'border-amber-200/50 dark:border-amber-800/50' },
		rejected: { text: 'Rejected', color: 'rose', bgColor: 'bg-rose-50 dark:bg-rose-950/30', textColor: 'text-rose-700 dark:text-rose-400', borderColor: 'border-rose-200/50 dark:border-rose-800/50' },
		active: { text: 'Active', color: 'emerald', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30', textColor: 'text-emerald-700 dark:text-emerald-400', borderColor: 'border-emerald-200/50 dark:border-emerald-800/50' },
		inactive: { text: 'Inactive', color: 'zinc', bgColor: 'bg-zinc-50 dark:bg-zinc-800/50', textColor: 'text-zinc-600 dark:text-zinc-400', borderColor: 'border-zinc-200/50 dark:border-zinc-700/50' },
		published: { text: 'Published', color: 'emerald', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30', textColor: 'text-emerald-700 dark:text-emerald-400', borderColor: 'border-emerald-200/50 dark:border-emerald-800/50' },
		draft: { text: 'Draft', color: 'zinc', bgColor: 'bg-zinc-50 dark:bg-zinc-800/50', textColor: 'text-zinc-600 dark:text-zinc-400', borderColor: 'border-zinc-200/50 dark:border-zinc-700/50' },
		archived: { text: 'Archived', color: 'zinc', bgColor: 'bg-zinc-50 dark:bg-zinc-800/50', textColor: 'text-zinc-600 dark:text-zinc-400', borderColor: 'border-zinc-200/50 dark:border-zinc-700/50' },
		success: { text: 'Success', color: 'emerald', bgColor: 'bg-emerald-50 dark:bg-emerald-950/30', textColor: 'text-emerald-700 dark:text-emerald-400', borderColor: 'border-emerald-200/50 dark:border-emerald-800/50' },
		error: { text: 'Error', color: 'rose', bgColor: 'bg-rose-50 dark:bg-rose-950/30', textColor: 'text-rose-700 dark:text-rose-400', borderColor: 'border-rose-200/50 dark:border-rose-800/50' },
		warning: { text: 'Warning', color: 'amber', bgColor: 'bg-amber-50 dark:bg-amber-950/30', textColor: 'text-amber-700 dark:text-amber-400', borderColor: 'border-amber-200/50 dark:border-amber-800/50' },
		info: { text: 'Info', color: 'blue', bgColor: 'bg-blue-50 dark:bg-blue-950/30', textColor: 'text-blue-700 dark:text-blue-400', borderColor: 'border-blue-200/50 dark:border-blue-800/50' },
		default: { text: 'Unknown', color: 'zinc', bgColor: 'bg-zinc-50 dark:bg-zinc-800/50', textColor: 'text-zinc-600 dark:text-zinc-400', borderColor: 'border-zinc-200/50 dark:border-zinc-700/50' }
	};

	export interface StatusBadgeProps {
		status: string | null | undefined;
		customConfig?: Record<string, StatusConfig>;
		size?: 'sm' | 'md' | 'lg';
		clickable?: boolean;
		onClick?: () => void;
	}

	let {
		status,
		customConfig,
		size = 'md',
		clickable = false,
		onClick
	}: StatusBadgeProps = $props();

	const config = $derived(() => {
		if (!status) return defaultConfig.default;
		const key = status.toLowerCase() as StatusType;
		return customConfig?.[key] ?? defaultConfig[key] ?? { ...defaultConfig.default, text: status };
	});

	const sizeClasses = $derived({
		sm: 'px-1.5 py-0.5 text-[10px]',
		md: 'px-2 py-0.5 text-xs',
		lg: 'px-2.5 py-1 text-sm'
	});

	function handleClick() {
		if (clickable && onClick) {
			onClick();
		}
	}
</script>

<span
	class={`inline-flex items-center gap-1 font-semibold capitalize ${RADIUS.badge} ${config().bgColor} ${config().textColor} border ${config().borderColor} ${sizeClasses[size]} ${clickable ? 'cursor-pointer hover:opacity-80' : ''}`}
	role={clickable ? 'button' : undefined}
	tabindex={clickable ? 0 : undefined}
	onclick={clickable ? handleClick : undefined}
>
	{#if config().icon === 'check-circle'}
		<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	{:else if config().icon === 'clock'}
		<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	{:else if config().icon === 'x-circle'}
		<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	{:else if config().icon === 'minus-circle'}
		<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
		</svg>
	{/if}
	{config().text}
</span>

<style>
	.capitalize {
		text-transform: capitalize;
	}
</style>