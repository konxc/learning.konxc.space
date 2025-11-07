<script lang="ts">
	type FullAutoFill =
		| 'name'
		| 'honorific-prefix'
		| 'given-name'
		| 'additional-name'
		| 'family-name'
		| 'honorific-suffix'
		| 'nickname'
		| 'email'
		| 'username'
		| 'new-password'
		| 'current-password'
		| 'one-time-code'
		| 'organization-title'
		| 'organization'
		| 'street-address'
		| 'address-line1'
		| 'address-line2'
		| 'address-line3'
		| 'address-level4'
		| 'address-level3'
		| 'address-level2'
		| 'address-level1'
		| 'country'
		| 'country-name'
		| 'postal-code'
		| 'cc-name'
		| 'cc-given-name'
		| 'cc-additional-name'
		| 'cc-family-name'
		| 'cc-number'
		| 'cc-exp'
		| 'cc-exp-month'
		| 'cc-exp-year'
		| 'cc-csc'
		| 'cc-type'
		| 'transaction-amount'
		| 'transaction-currency'
		| 'language'
		| 'bday'
		| 'bday-day'
		| 'bday-month'
		| 'bday-year'
		| 'sex'
		| 'tel'
		| 'tel-country-code'
		| 'tel-national'
		| 'tel-area-code'
		| 'tel-local'
		| 'tel-extension'
		| 'impp'
		| 'url'
		| 'photo'
		| 'off'
		| 'on';

	interface Props {
		label: string;
		type?: string;
		name: string;
		placeholder?: string;
		required?: boolean;
		autocomplete?: FullAutoFill | null;
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
