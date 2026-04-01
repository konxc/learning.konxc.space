<script lang="ts">
	import Modal from './Modal.svelte';
	import Button from './Button.svelte';
	import { toast } from '$lib/stores/toastStore';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { Snippet } from 'svelte';
	import type { SubmitFunction } from '@sveltejs/kit';

	interface CrudModalProps {
		isOpen: boolean;
		title: string;
		action?: string;
		onClose: () => void;
		onSuccess?: () => void;
		successMessage?: string;
		errorMessage?: string;
		submitLabel?: string;
		cancelLabel?: string;
		submitting?: boolean;
		children: Snippet;
	}

	let {
		isOpen,
		title,
		action,
		onClose,
		onSuccess,
		successMessage = 'Berhasil',
		errorMessage = 'Gagal menyimpan',
		submitLabel = 'Simpan',
		cancelLabel = 'Batal',
		submitting = $bindable(false),
		children
	}: CrudModalProps = $props();

	let formRef: HTMLFormElement | undefined = $state(undefined);

	const handleSubmit: SubmitFunction = () => {
		submitting = true;
		return async ({ result }) => {
			submitting = false;
			if (result.type === 'success') {
				toast.success(successMessage);
				onSuccess?.();
				await invalidateAll();
			} else if (result.type === 'failure' && result.data?.error) {
				toast.error(String(result.data.error));
			} else if (result.type === 'error') {
				toast.error(errorMessage);
			}
		};
	};

	function handleCancel() {
		onClose();
	}
</script>

<Modal {isOpen} {title} {onClose}>
	<form bind:this={formRef} method="POST" {action} use:enhance={handleSubmit} class="space-y-4">
		{@render children()}

		<div class="flex justify-end gap-3 pt-4">
			<Button variant="ghost" onclick={handleCancel} disabled={submitting}>
				{cancelLabel}
			</Button>
			<Button type="submit" variant="primary" disabled={submitting}>
				{submitting ? 'Menyimpan...' : submitLabel}
			</Button>
		</div>
	</form>
</Modal>
