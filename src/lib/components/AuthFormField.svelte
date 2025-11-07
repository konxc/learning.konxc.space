<script lang="ts">
	import type { FullAutoFill } from 'svelte/elements';

	type AutoCompleteValue = FullAutoFill | 'on' | 'off';

	interface Props {
		label: string;
		type?: string;
		name: string;
		placeholder?: string;
		required?: boolean;
		autocomplete?: AutoCompleteValue | null;
		pattern?: string;
		minlength?: number;
		maxlength?: number;
		hint?: string;
	}

	let {
		label,
		type = 'text',
		name,
		placeholder,
		required = false,
		autocomplete,
		pattern,
		minlength,
		maxlength,
		hint
	}: Props = $props();
</script>

<div class="form-group">
	<label for={name}>{label}</label>
	<input
		{type}
		id={name}
		{name}
		{required}
		{autocomplete}
		{placeholder}
		{pattern}
		{minlength}
		{maxlength}
	/>
	{#if hint}
		<small>{hint}</small>
	{/if}
</div>

<style>
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	label {
		font-weight: 600;
		color: var(--color-primary-dark);
		font-size: 0.95em;
	}

	input {
		padding: 12px 16px;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		font-size: 1em;
		transition: all 0.2s ease;
		font-family: inherit;
	}

	input:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	small {
		font-size: 0.85em;
		color: var(--color-primary-medium);
	}
</style>
