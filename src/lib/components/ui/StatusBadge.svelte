<script lang="ts">
	import { RADIUS, TEXT, STATUS } from '$lib/config/design';
	import { toast } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';

	export type StatusType =
		| 'approved'
		| 'pending'
		| 'rejected'
		| 'active'
		| 'inactive'
		| 'published'
		| 'draft'
		| 'archived'
		| 'success'
		| 'error'
		| 'warning'
		| 'info'
		| 'default';

	export interface StatusConfig {
		text: string;
		color: string;
		icon?: string;
		bgColor?: string;
		textColor?: string;
		borderColor?: string;
	}

	// Map status types to STATUS tokens
	const defaultConfig: Record<StatusType, StatusConfig> = {
		approved: {
			text: 'Approved',
			color: 'emerald',
			bgColor: STATUS.success.bg,
			textColor: STATUS.success.text,
			borderColor: STATUS.success.border
		},
		pending: {
			text: 'Pending',
			color: 'amber',
			bgColor: STATUS.pending.bg,
			textColor: STATUS.pending.text,
			borderColor: STATUS.pending.border
		},
		rejected: {
			text: 'Rejected',
			color: 'rose',
			bgColor: STATUS.error.bg,
			textColor: STATUS.error.text,
			borderColor: STATUS.error.border
		},
		active: {
			text: 'Active',
			color: 'emerald',
			bgColor: STATUS.success.bg,
			textColor: STATUS.success.text,
			borderColor: STATUS.success.border
		},
		inactive: {
			text: 'Inactive',
			color: 'zinc',
			bgColor: STATUS.neutral.bg,
			textColor: STATUS.neutral.text,
			borderColor: STATUS.neutral.border
		},
		published: {
			text: 'Published',
			color: 'emerald',
			bgColor: STATUS.success.bg,
			textColor: STATUS.success.text,
			borderColor: STATUS.success.border
		},
		draft: {
			text: 'Draft',
			color: 'zinc',
			bgColor: STATUS.neutral.bg,
			textColor: STATUS.neutral.text,
			borderColor: STATUS.neutral.border
		},
		archived: {
			text: 'Archived',
			color: 'zinc',
			bgColor: STATUS.neutral.bg,
			textColor: STATUS.neutral.text,
			borderColor: STATUS.neutral.border
		},
		success: {
			text: 'Success',
			color: 'emerald',
			bgColor: STATUS.success.bg,
			textColor: STATUS.success.text,
			borderColor: STATUS.success.border
		},
		error: {
			text: 'Error',
			color: 'rose',
			bgColor: STATUS.error.bg,
			textColor: STATUS.error.text,
			borderColor: STATUS.error.border
		},
		warning: {
			text: 'Warning',
			color: 'amber',
			bgColor: STATUS.warning.bg,
			textColor: STATUS.warning.text,
			borderColor: STATUS.warning.border
		},
		info: {
			text: 'Info',
			color: 'blue',
			bgColor: STATUS.info.bg,
			textColor: STATUS.info.text,
			borderColor: STATUS.info.border
		},
		default: {
			text: 'Unknown',
			color: 'zinc',
			bgColor: STATUS.neutral.bg,
			textColor: STATUS.neutral.text,
			borderColor: STATUS.neutral.border
		}
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
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	{:else if config().icon === 'clock'}
		<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	{:else if config().icon === 'x-circle'}
		<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
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
