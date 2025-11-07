<script lang="ts">
	import { RADIUS, SPACING, COLOR, TRANSITION } from '$lib/config/design';
	import type { Snippet } from 'svelte';

	let {
		id,
		label,
		type = 'text',
		value = $bindable(),
		placeholder,
		disabled = false,
		required = false,
		autocomplete,
		children
	} = $props<{
		id?: string;
		label?: string;
		type?: string;
		value?: string | number;
		placeholder?: string;
		disabled?: boolean;
		required?: boolean;
		autocomplete?: string;
		children?: Snippet;
	}>();
</script>

{#if label}
	<label class={`mb-1 block text-sm font-medium ${COLOR.textPrimary}`} for={id}>{label}</label>
{/if}
<input
	class={`w-full ${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} text-sm outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60`}
	{id}
	{type}
	bind:value
	{placeholder}
	{disabled}
	{required}
	autocomplete={autocomplete || undefined}
/>
{@render children?.()}
