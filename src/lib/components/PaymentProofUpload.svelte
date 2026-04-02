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

		if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) {
			error = 'Format yang diperbolehkan: JPEG, PNG, atau WebP';
			input.value = '';
			return;
		}

		if (selectedFile.size > 5 * 1024 * 1024) {
			error = 'Ukuran file maksimal 5MB';
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

					let width = img.width;
					let height = img.height;
					const maxWidth = 1200;

					if (width > maxWidth) {
						height = (height * maxWidth) / width;
						width = maxWidth;
					}

					canvas.width = width;
					canvas.height = height;
					ctx?.drawImage(img, 0, 0, width, height);
					const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);

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

	$effect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	});

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
			error = 'Sistem pembayaran belum siap. Silakan refresh halaman.';
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

			console.log('Payment response status:', response.status);

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Payment failed with status:', response.status, errorText);
				throw new Error(`Server error: ${response.status}`);
			}

			const contentType = response.headers.get('content-type');
			if (!contentType?.includes('application/json')) {
				const text = await response.text();
				console.error('Non-JSON response:', text.substring(0, 500));
				throw new Error('Respons server tidak valid.');
			}

			const result = await response.json();
			console.log('Payment result:', result);

			let data: any;

			if (typeof result.data === 'string') {
				console.log('Result data is string, parsing:', result.data);

				try {
					const parsed = JSON.parse(result.data);
					console.log('Parsed result:', parsed);

					if (Array.isArray(parsed) && parsed.length >= 6) {
						data = {
							orderId: parsed[3],
							snapToken: parsed[4],
							redirectUrl: parsed[5]
						};
						console.log('Extracted actual values from array:', data);
					} else if (Array.isArray(parsed) && parsed.length >= 3) {
						const dataObj = parsed.find(
							(p) => p && typeof p === 'object' && typeof p.snapToken === 'string'
						);
						if (dataObj) {
							data = dataObj;
						} else if (typeof parsed[2] === 'object') {
							data = parsed[2];
						}
					} else if (typeof parsed === 'object') {
						data = parsed;
					}
				} catch (parseErr) {
					console.error('Failed to parse result data:', parseErr);
				}
			} else if (result.type === 'success' && result.data) {
				data = result.data;
			} else if (result.success === true && result.data) {
				data = result.data;
			} else if (result.type === 'failure') {
				throw new Error(result.data?.error || 'Gagal membuat transaksi');
			} else if (result.success === false || result.error) {
				throw new Error(result.error || result.message || 'Gagal membuat transaksi');
			} else {
				data = result;
			}

			console.log('Final parsed data:', data);

			if (data?.snapToken) {
				(window as any).snap.pay(data.snapToken, {
					onSuccess: function () {
						goto('/app/payments?status=success&orderId=' + (data.orderId || ''));
					},
					onPending: function () {
						goto('/app/payments?status=pending');
					},
					onError: function () {
						error = 'Pembayaran gagal. Silakan coba lagi.';
						isProcessingOnline = false;
					},
					onClose: function () {
						isProcessingOnline = false;
					}
				});
			} else {
				console.error('No snapToken in response:', data);
				throw new Error(data?.error || 'Gagal membuat transaksi - tidak ada token');
			}
		} catch (err) {
			console.error('Payment error:', err);
			error = err instanceof Error ? err.message : 'Gagal memproses pembayaran';
			isProcessingOnline = false;
		}
	}
</script>

<div class={`${RADIUS.card} ${COLOR.card} p-6 md:p-8 ${ELEVATION.base}`}>
	<div class="mb-6 border-b border-dashed border-zinc-200 pb-4 dark:border-zinc-700">
		<h3 class={`${TEXT.h3} ${COLOR.textPrimary}`}>Metode Pembayaran</h3>
		<p class={`${TEXT.body} ${COLOR.textSecondary} mt-1`}>
			Kursus: <span class="font-semibold">{courseTitle}</span>
		</p>
	</div>

	{#if error}
		<div class={`mb-6 ${RADIUS.small} ${SPACING.input} ${COLOR.error} ${TEXT.body}`} role="alert">
			{error}
		</div>
	{/if}

	{#if existingProof}
		<div class={`mb-6 ${RADIUS.small} ${SPACING.input} ${COLOR.warning}`}>
			<div class="flex items-center gap-2">
				{#if existingProof.status === 'pending'}
					<span
						class={`inline-block ${RADIUS.badge} px-3 py-1 ${TEXT.small} font-semibold ${COLOR.warningBg}`}
						>Menunggu Verifikasi</span
					>
				{:else if existingProof.status === 'rejected'}
					<span
						class={`inline-block ${RADIUS.badge} px-3 py-1 ${TEXT.small} font-semibold ${COLOR.errorBg}`}
						>Ditolak</span
					>
				{/if}
			</div>
			<p class={`${TEXT.body} ${COLOR.textSecondary} mt-2 text-sm`}>
				Unggah ulang untuk mengganti bukti yang ada
			</p>
		</div>
	{/if}

	<div class="space-y-6">
		<div>
			<h4 class={`${TEXT.h4} ${COLOR.textPrimary} mb-4 flex items-center gap-2`}>
				<span
					class="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300"
					>1</span
				>
				Transfer Manual
			</h4>
			<p class={`${TEXT.body} ${COLOR.textSecondary} mb-4 text-sm`}>
				Upload bukti transfer untuk verifikasi manual oleh admin.
			</p>

			<form method="POST" action="?/uploadProof" use:enhance={handleSubmit} class="space-y-4">
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

				<div>
					<input
						type="file"
						id="proofFile"
						accept="image/jpeg,image/png,image/webp"
						onchange={handleFileSelect}
						disabled={isUploading || isProcessingOnline}
						class="hidden"
					/>
					<label
						for="proofFile"
						class={`inline-flex cursor-pointer items-center gap-2 ${RADIUS.button} border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 ${TEXT.button} ${COLOR.textSecondary} ${TRANSITION.all} hover:border-blue-500 hover:bg-blue-50 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:border-blue-500 dark:hover:bg-blue-900/20`}
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						{file ? 'Ganti File' : 'Pilih File'}
					</label>
					{#if file}
						<span class="ml-3 text-sm text-zinc-500 dark:text-zinc-400">{file.name}</span>
					{/if}
				</div>

				{#if previewUrl}
					<div class="relative">
						<img
							src={previewUrl}
							alt="Preview bukti pembayaran"
							class="mx-auto max-h-48 rounded-lg border border-zinc-200 shadow-sm dark:border-zinc-700"
						/>
						<button
							type="button"
							onclick={removePreview}
							class="absolute top-2 right-2 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600"
							aria-label="Remove preview"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				{/if}

				<button
					type="submit"
					disabled={!file || isUploading || isProcessingOnline}
					class={`w-full ${RADIUS.button} ${COLOR.accentBg} ${COLOR.accentHover} flex items-center justify-center gap-2 px-6 py-3 ${TEXT.button} font-semibold text-white ${TRANSITION.all} ${ELEVATION.base} disabled:cursor-not-allowed disabled:opacity-60`}
				>
					{#if isUploading}
						<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Mengunggah...
					{:else}
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
							/>
						</svg>
						Unggah Bukti Transfer
					{/if}
				</button>
			</form>
		</div>

		<div class="flex items-center gap-4">
			<div class="h-px flex-1 bg-zinc-200 dark:bg-zinc-700"></div>
			<span class={`${TEXT.small} font-medium text-zinc-400`}>ATAU</span>
			<div class="h-px flex-1 bg-zinc-200 dark:bg-zinc-700"></div>
		</div>

		<div>
			<h4 class={`${TEXT.h4} ${COLOR.textPrimary} mb-4 flex items-center gap-2`}>
				<span
					class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
					>2</span
				>
				Pembayaran Instan
			</h4>
			<p class={`${TEXT.body} ${COLOR.textSecondary} mb-4 text-sm`}>
				Pembayaran langsung dengan GoPay, QRIS, atau transfer bank. Proses otomatis & cepat.
			</p>

			<button
				type="button"
				disabled={isUploading || isProcessingOnline || !midtransClientKey}
				onclick={handleOnlinePayment}
				class={`w-full ${RADIUS.button} relative overflow-hidden bg-linear-to-br from-emerald-500 to-teal-600 px-6 py-4 ${TEXT.button} font-bold text-white ${TRANSITION.all} ${ELEVATION.base} hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50`}
			>
				<span class="relative z-10 flex items-center justify-center gap-3">
					{#if isProcessingOnline}
						<svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						Menyiapkan pembayaran...
					{:else}
						<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none">
							<path
								d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
								fill="#00AA12"
							/>
							<path d="M12 7.5v9l7.5-4.5-7.5-4.5z" fill="white" />
						</svg>
						Bayar dengan GoPay / QRIS / Bank Transfer
					{/if}
				</span>
			</button>

			<p class="mt-3 text-center text-xs text-zinc-400">
				🔒 Pembayaran diproses oleh Midtrans. Aman & terpercaya.
			</p>
		</div>
	</div>
</div>
