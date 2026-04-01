<script lang="ts">
	import { RADIUS, COLOR, TEXT, ELEVATION, SPACING } from '$lib/config/design';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/stores/toastStore';
	import { fly } from 'svelte/transition';

	export interface FormWrapperProps {
		action?: string;
		method?: 'POST' | 'GET';
		enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
		successMessage?: string;
		errorMessage?: string;
		redirectTo?: string;
		loadingText?: string;
		showSuccessToast?: boolean;
		showErrorToast?: boolean;
		onSubmit?: () => void;
		onSuccess?: () => void;
		onError?: () => void;
		children?: import('svelte').Snippet;
		footer?: import('svelte').Snippet;
	}

	let {
		action = '',
		method = 'POST',
		enctype = 'application/x-www-form-urlencoded',
		successMessage,
		errorMessage,
		redirectTo,
		loadingText = 'Menyimpan...',
		showSuccessToast = true,
		showErrorToast = true,
		onSubmit,
		onSuccess,
		onError,
		children,
		footer
	}: FormWrapperProps = $props();

	let isSubmitting = $state(false);
	let formState = $state<'idle' | 'success' | 'error'>('idle');
	let errorMessageText = $state('');

	function handleSubmit() {
		isSubmitting = true;
		formState = 'idle';
		onSubmit?.();
	}

	async function handleResponse({
		result,
		update
	}: {
		result: any;
		update: (opts?: any) => Promise<void>;
	}) {
		isSubmitting = false;

		if (result.type === 'success') {
			formState = 'success';
			if (showSuccessToast && successMessage) {
				toast.success(successMessage);
			}
			onSuccess?.();
			if (redirectTo) {
				await update({ reset: true });
				setTimeout(() => {
					window.location.href = redirectTo;
				}, 500);
			}
		} else if (result.type === 'failure') {
			formState = 'error';
			const error =
				result.data?.error || result.data?.message || errorMessage || 'Terjadi kesalahan';
			errorMessageText = error;
			if (showErrorToast) {
				toast.error(error);
			}
			onError?.();
		}

		await update({ reset: false });
	}
</script>

<form
	{action}
	{method}
	{enctype}
	use:enhance={() => {
		handleSubmit();
		return async ({ result, update }) => {
			await handleResponse({ result, update });
		};
	}}
	class="contents"
>
	{#if formState === 'error' && errorMessageText}
		<div
			class={`mb-4 ${RADIUS.button} ${SPACING.cardPadding} ${COLOR.error} ${ELEVATION.base}`}
			role="alert"
			transition:fly={{ y: -10, duration: 200 }}
		>
			<p class="font-medium">{errorMessageText}</p>
		</div>
	{/if}

	{#if children}
		{@render children()}
	{/if}

	{#if footer}
		<div class="mt-6 flex justify-end gap-3">
			{@render footer()}
		</div>
	{/if}
</form>

<style>
	form {
		display: contents;
	}
</style>
