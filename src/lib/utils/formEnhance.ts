import { toast } from '$lib/stores/toastStore';
import type { SubmitFunction } from '@sveltejs/kit';

interface FormResultData {
	error?: string;
	message?: string;
	success?: boolean;
	toastType?: 'success' | 'error' | 'info' | 'warning';
}

export interface FormToastConfig {
	/** Toast message shown on success (result.type === 'success') */
	success: string;
	/** Toast message shown on failure (result.type === 'failure'). Falls back to server error. */
	error: string;
	/** Custom toast type for success. Defaults to 'success'. */
	successType?: 'success' | 'info' | 'warning';
	/** Callback invoked before the submit handler returns (before update/processing) */
	onStart?: () => void;
	/** Callback invoked after success handling */
	onSuccess?: () => void;
	/** Callback invoked after failure handling */
	onFailure?: () => void;
	/** Callback invoked after update() + processing, regardless of success/failure */
	onEnd?: () => void;
	/** Whether to call update() before showing toasts. Defaults to true. */
	withUpdate?: boolean;
}

/**
 * Creates an `enhance` callback with standardized toast handling.
 *
 * @example
 * ```svelte
 * <form method="POST" action="?/create"
 *   use:enhance={formToast({
 *     success: 'Batch berhasil dibuat!',
 *     error: 'Gagal membuat batch',
 *     onStart: () => (creating = true),
 *     onSuccess: () => (showCreateForm = false)
 *   })}
 * >
 * ```
 */
export function formToast(config: FormToastConfig): SubmitFunction {
	const {
		success,
		error,
		onStart,
		onSuccess,
		onFailure,
		onEnd,
		withUpdate = true,
		successType = 'success'
	} = config;

	return () => {
		onStart?.();
		return async ({ result, update }) => {
			if (withUpdate) await update();

			if (result.type === 'success') {
				const data = (result.data ?? {}) as FormResultData;
				const msg = data.message ?? success;
				const type = data.toastType ?? successType;
				switch (type) {
					case 'info':
						toast.info(msg);
						break;
					case 'warning':
						toast.warning(msg);
						break;
					default:
						toast.success(msg);
				}
				onSuccess?.();
			} else if (result.type === 'failure') {
				const data = (result.data ?? {}) as FormResultData;
				toast.error(data.error ?? error);
				onFailure?.();
			}
			onEnd?.();
		};
	};
}
