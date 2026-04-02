<script lang="ts">
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import { browser } from '$app/environment';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { toast } from '$lib/stores/toastStore';
	import type { SubmitFunction } from '@sveltejs/kit';

	interface Props {
		courseId: string;
		courseTitle: string;
		existingProof?: { status: string } | null;
		midtransClientKey?: string;
	}

	let { courseId, courseTitle, existingProof, midtransClientKey }: Props = $props();

	let file: File | null = $state(null);
	let error: string | null = $state(null);
	let isUploading: boolean = $state(false);
	let isProcessingOnline: boolean = $state(false);
	let previewUrl: string | null = $state(null);

	async function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (!input.files?.[0]) return;

		const selectedFile = input.files[0];
		error = null;

		// Validate file type
		if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) {
			error = 'Only JPEG, PNG, or WebP images are allowed';
			input.value = '';
			return;
		}

		// Validate file size (raw, before compression)
		if (selectedFile.size > 5 * 1024 * 1024) {
			// 5MB
			error = 'File size exceeds 5MB limit';
			input.value = '';
			return;
		}

		file = selectedFile;
		previewUrl = URL.createObjectURL(selectedFile);
	}

	async function compressImage(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				const img = new Image();
				img.onload = () => {
					const canvas = document.createElement('canvas');
					const ctx = canvas.getContext('2d');

					// Calculate new dimensions (max width 1200px, maintain aspect ratio)
					let width = img.width;
					let height = img.height;
					const maxWidth = 1200;

					if (width > maxWidth) {
						height = (height * maxWidth) / width;
						width = maxWidth;
					}

					canvas.width = width;
					canvas.height = height;

					// Draw and compress
					ctx?.drawImage(img, 0, 0, width, height);
					const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8); // 80% quality

					resolve(compressedBase64);
				};
				img.onerror = reject;
				img.src = e.target?.result as string;
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	const handleSubmit: SubmitFunction = () => {
		isUploading = true;
		error = null;

		return async ({ result, update }) => {
			isUploading = false;

			if (result.type === 'success') {
				await update();
				toast.success('Bukti pembayaran berhasil diunggah');
			} else if (result.type === 'redirect') {
				await goto(result.location);
			} else if (result.type === 'failure') {
				const data = result.data as any;
				error =
					typeof data?.message === 'object'
						? JSON.stringify(data.message)
						: data?.message || 'Gagal mengunggah bukti pembayaran';
			} else if (result.type === 'error') {
				error = 'Terjadi kesalahan sistem. Silakan coba lagi.';
			}
		};
	};

	function removePreview() {
		file = null;
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			previewUrl = null;
		}
	}

	// Cleanup
	$effect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	});

	// Handle Midtrans Snap Script
	$effect(() => {
		if (browser && midtransClientKey) {
			const script = document.createElement('script');
			script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
			script.setAttribute('data-client-key', midtransClientKey);
			document.head.appendChild(script);
			return () => {
				const existingScript = document.querySelector(
					`script[data-client-key="${midtransClientKey}"]`
				);
				if (existingScript) document.head.removeChild(existingScript);
			};
		}
	});

	async function handleOnlinePayment() {
		if (!browser || !(window as any).snap) {
			error = 'Online payment system is not ready. Please refresh the page.';
			return;
		}

		isProcessingOnline = true;
		error = null;

		try {
			const formData = new FormData();
			formData.append('courseId', courseId);

			const response = await fetch('?/createOnlineTransaction', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			// Handle SvelteKit form action return format
			// actionSuccess returns: { type: 'success', data: { ... } }
			// actionFailure returns: { type: 'failure', data: { error: '...' } }
			let data: any;

			if (result.type === 'success' && result.data) {
				data = result.data;
			} else if (result.type === 'failure') {
				throw new Error(result.data?.error || 'Failed to create online transaction');
			} else {
				// Fallback for direct returns
				data = result;
			}

			if (data.snapToken) {
				(window as any).snap.pay(data.snapToken, {
					onSuccess: function () {
						goto('/app/learning/courses?payment=success');
					},
					onPending: function () {
						goto('/app/payments?status=pending');
					},
					onError: function () {
						error = 'Payment failed. Please try again.';
						isProcessingOnline = false;
					},
					onClose: function () {
						isProcessingOnline = false;
					}
				});
			} else {
				throw new Error(data?.error || 'Failed to create online transaction');
			}
		} catch (err) {
			console.error('Payment error:', err);
			error = err instanceof Error ? err.message : 'Failed to process online payment';
			isProcessingOnline = false;
		}
	}
</script>

<div class={`${RADIUS.card} ${COLOR.card} p-8 ${ELEVATION.base}`}>
	<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>Upload Payment Proof</h3>
	<p class={`${TEXT.body} ${COLOR.textSecondary} mb-5`}>Course: {courseTitle}</p>

	{#if error}
		<div
			class={`mb-4 ${RADIUS.small} ${SPACING.input} ${COLOR.error} ${TEXT.body} font-medium`}
			role="alert"
		>
			{error}
		</div>
	{/if}

	{#if existingProof}
		<div class={`mb-4 ${RADIUS.small} ${SPACING.input} ${COLOR.warning}`}>
			<div class="flex items-center gap-2">
				{#if existingProof.status === 'pending'}
					<span
						class={`inline-block ${RADIUS.badge} px-3 py-1 ${TEXT.small} font-semibold ${COLOR.warningBg}`}
						>Reviewing</span
					>
				{:else if existingProof.status === 'rejected'}
					<span
						class={`inline-block ${RADIUS.badge} px-3 py-1 ${TEXT.small} font-semibold ${COLOR.errorBg}`}
						>Rejected</span
					>
				{/if}
			</div>
			<p class={`${TEXT.body} ${COLOR.textSecondary} mt-2 text-sm`}>
				Upload again to replace existing proof
			</p>
		</div>
	{/if}

	<form method="POST" action="?/uploadProof" use:enhance={handleSubmit} class="space-y-5">
		<input type="hidden" name="courseId" value={courseId} />

		{#if file}
			{#await compressImage(file) then compressed}
				<input type="hidden" name="dataBase64" value={compressed.split(',')[1]} />
				<input type="hidden" name="mime" value={file.type} />
				<input
					type="hidden"
					name="size"
					value={Math.round((compressed.split(',')[1].length * 3) / 4).toString()}
				/>
			{/await}
		{/if}

		<div class="mb-5">
			<input
				type="file"
				id="proofFile"
				accept="image/jpeg,image/png,image/webp"
				onchange={handleFileSelect}
				disabled={isUploading}
				class="hidden"
			/>
			<label
				for="proofFile"
				class={`inline-block cursor-pointer ${RADIUS.button} border-2 border-dashed border-gray-300 bg-gray-100 px-6 py-3 ${TEXT.button} ${COLOR.textPrimary} ${TRANSITION.all} hover:border-blue-600 hover:bg-gray-200 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-blue-500 dark:hover:bg-neutral-700`}
			>
				Select image file
			</label>
		</div>

		{#if previewUrl}
			<div class="mb-5 text-center">
				<img
					src={previewUrl}
					alt="Payment proof preview"
					class="mx-auto max-h-[400px] max-w-full rounded-lg shadow-md"
				/>
				<button
					type="button"
					onclick={removePreview}
					class={`mt-3 block ${RADIUS.small} bg-red-600 px-4 py-2 ${TEXT.small} font-semibold text-white ${TRANSITION.all} hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-1`}
				>
					Remove
				</button>
			</div>
		{/if}

		<button
			type="submit"
			disabled={!file || isUploading || isProcessingOnline}
			class={`w-full ${RADIUS.button} bg-linear-to-br from-blue-600 to-purple-600 px-6 py-3 ${TEXT.button} font-semibold text-white ${TRANSITION.all} ${ELEVATION.base} hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0`}
		>
			{isUploading ? 'Uploading...' : 'Upload Payment Proof'}
		</button>
	</form>

	<div class="my-8 flex items-center gap-4">
		<div class="h-px flex-1 bg-gray-200 dark:bg-neutral-800"></div>
		<span class={`${TEXT.small} font-medium text-gray-400`}>OR PAY INSTANTLY</span>
		<div class="h-px flex-1 bg-gray-200 dark:bg-neutral-800"></div>
	</div>

	<button
		type="button"
		disabled={isUploading || isProcessingOnline}
		onclick={handleOnlinePayment}
		class={`w-full ${RADIUS.button} border-2 border-blue-600 bg-white px-6 py-3 ${TEXT.button} font-bold text-blue-600 ${TRANSITION.all} hover:bg-blue-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50`}
	>
		{isProcessingOnline ? 'Preparing...' : '💳 Pay via GoPay / QRIS / Bank Transfer'}
	</button>

	<p class="mt-4 text-center text-[10px] text-gray-400">
		Midtrans payments are processed automatically 24/7.
	</p>
</div>
