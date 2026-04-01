<script lang="ts">
	import { RADIUS, COLOR, SPACING, INPUT, FOCUS, TRANSITION, TEXT } from '$lib/config/design';
	import type { Snippet } from 'svelte';

	interface SelectOption {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface SelectProps {
		name?: string;
		value?: string;
		label?: string;
		placeholder?: string;
		options: SelectOption[];
		required?: boolean;
		disabled?: boolean;
		error?: string;
		size?: 'sm' | 'md' | 'lg';
		onchange?: (value: string) => void;
		children?: Snippet;
	}

	let {
		name,
		value = $bindable(''),
		label,
		placeholder = 'Pilih...',
		options,
		required = false,
		disabled = false,
		error,
		size = 'md',
		onchange,
		children
	}: SelectProps = $props();

	const sizeClasses = {
		sm: 'px-2.5 py-1.5 text-xs',
		md: 'px-3 py-2 text-sm',
		lg: 'px-4 py-3 text-base'
	};
</script>

<div class="w-full">
	{#if label}
		<label for={name} class={`mb-1.5 block text-sm font-medium ${COLOR.textPrimary}`}>
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}

	<div class="relative">
		<select
			id={name}
			{name}
			{required}
			{disabled}
			bind:value
			onchange={(e) => onchange?.((e.target as HTMLSelectElement).value)}
			class={`w-full appearance-none ${RADIUS.input} border ${sizeClasses[size]} pr-10 ${INPUT.focus} ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${error ? 'border-red-500' : `${COLOR.cardBorder}`} ${COLOR.card} ${COLOR.textPrimary}`}
		>
			{#if placeholder}
				<option value="" disabled selected={!value}>{placeholder}</option>
			{/if}
			{#each options as option}
				<option value={option.value} disabled={option.disabled}>
					{option.label}
				</option>
			{/each}
		</select>

		<!-- Chevron icon -->
		<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
			<svg
				class={`h-4 w-4 ${COLOR.textMuted}`}
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</div>
	</div>

	{#if error}
		<p class="mt-1 text-xs text-red-500">{error}</p>
	{/if}

	{#if children}
		{@render children()}
	{/if}
</div>
