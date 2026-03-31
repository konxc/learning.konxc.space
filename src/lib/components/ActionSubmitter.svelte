<script lang="ts">
	import { COLOR, RADIUS, SPACING, TEXT, TRANSITION } from '$lib/config/design';
	import { enhance } from '$app/forms';

	interface Props {
		lessonId: string;
		courseId: string;
		existingSubmission?: any;
		onSuccess?: () => void;
	}

	let { lessonId, courseId, existingSubmission, onSuccess }: Props = $props();

	let submitting = $state(false);
	let url = $state(existingSubmission?.payload?.url || '');
	let note = $state(existingSubmission?.payload?.note || '');
	let file: File | null = $state(null);
	let showSuccess = $state(false);
	let errorMessage = $state('');
	let uploadProgress = $state(0);

	// Validation logic for Cloud Submissions (Pondasi Pelajaran 4.4)
	const isCloudSubmission = $derived(
		url.includes('drive.google.com') || url.includes('docs.google.com')
	);
	const needsCloudValidation = $derived(
		lessonId.includes('cloud') || note.toLowerCase().includes('drive')
	); // Heuristic or can be prop-based

	const trackLabels: Record<string, string> = {
		creator: 'Video/Konten URL',
		seller: 'Link Toko/Produk',
		affiliate: 'Link Affiliate'
	};

	// File type validation
	const allowedFileTypes = [
		'application/pdf',
		'image/jpeg',
		'image/png',
		'image/webp',
		'application/zip',
		'text/plain'
	];
	const maxFileSize = 10 * 1024 * 1024; // 10MB

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const selectedFile = input.files[0];

			// Validate file type
			if (!allowedFileTypes.includes(selectedFile.type)) {
				errorMessage = 'File type not allowed. Please upload PDF, images, ZIP, or text files.';
				input.value = '';
				return;
			}

			// Validate file size
			if (selectedFile.size > maxFileSize) {
				errorMessage = 'File size exceeds 10MB limit.';
				input.value = '';
				return;
			}

			file = selectedFile;
			errorMessage = '';
		}
	}

	function removeFile() {
		file = null;
	}

	const handleEnhance = ({ cancel }: { cancel: () => void }) => {
		// Validation link Google Drive/Docs (Pondasi 4.4)
		if (
			url.includes('google.com') &&
			!url.includes('drive.google.com') &&
			!url.includes('docs.google.com')
		) {
			errorMessage = 'Harap gunakan link Google Drive/Docs yang valid.';
			cancel();
			return;
		}

		submitting = true;
		errorMessage = '';
		return async ({ result }: { result: any }) => {
			submitting = false;
			if (result.type === 'success') {
				showSuccess = true;
				if (onSuccess) onSuccess();
			} else if (result.type === 'failure') {
				const data = result.data as { error?: string } | undefined;
				errorMessage = data?.error || 'An error occurred. Please try again.';
			}
		};
	};
</script>

<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-6 shadow-sm`}>
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary}`}>Lapor Progres (Action)</h3>
			<p class={`${TEXT.small} ${COLOR.textMuted} mt-1`}>
				Kirimkan link hasil praktek Anda untuk dipantau oleh Mentor.
			</p>
		</div>
		<div class="text-3xl">🚀</div>
	</div>

	{#if showSuccess}
		<div
			class="animate-in fade-in zoom-in rounded-xl bg-green-50 p-6 text-center text-green-700 duration-500"
		>
			<div class="mb-2 text-3xl">✅</div>
			<p class="font-bold">Laporan Berhasil Terkirim!</p>
			<p class="mt-1 text-sm opacity-80">Mentor akan segera mereview progres Anda.</p>
			<button
				class="mt-4 text-xs font-bold underline"
				onclick={() => {
					showSuccess = false;
				}}>Kirim Ulang / Perbarui</button
			>
		</div>
	{:else}
		<form
			method="POST"
			action="?/submitAction"
			enctype="multipart/form-data"
			use:enhance={handleEnhance}
			class="space-y-4"
		>
			<input type="hidden" name="lessonId" value={lessonId} />
			<input type="hidden" name="courseId" value={courseId} />

			<div>
				<label
					for="url"
					class={`mb-1.5 block text-xs font-black tracking-widest uppercase ${COLOR.textMuted}`}
				>
					Link Hasil Praktek (TikTok/IG/Marketplace)
				</label>
				<input
					type="url"
					id="url"
					name="url"
					bind:value={url}
					placeholder="https://..."
					class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
				/>
			</div>

			<div>
				<label
					for="file"
					class={`mb-1.5 block text-xs font-black tracking-widest uppercase ${COLOR.textMuted}`}
				>
					Or Upload File (PDF, Images, ZIP, Text - Max 10MB)
				</label>
				<div
					class={`relative ${RADIUS.input} border-2 border-dashed ${COLOR.cardBorder} ${COLOR.card} p-4 text-center ${TRANSITION.all} hover:border-blue-400`}
				>
					<input
						type="file"
						id="file"
						name="file"
						accept=".pdf,.jpg,.jpeg,.png,.webp,.zip,.txt"
						onchange={handleFileChange}
						class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
					/>
					{#if file}
						<div class="flex items-center justify-center gap-3">
							<span class="text-2xl">📎</span>
							<div class="text-left">
								<p class={`${TEXT.body} font-semibold ${COLOR.textPrimary}`}>{file.name}</p>
								<p class={`${TEXT.small} ${COLOR.textMuted}`}>{(file.size / 1024).toFixed(1)} KB</p>
							</div>
							<button
								type="button"
								onclick={removeFile}
								class="ml-2 text-red-500 hover:text-red-700"
							>
								✕
							</button>
						</div>
					{:else}
						<div>
							<span class="text-3xl">📁</span>
							<p class={`${TEXT.body} ${COLOR.textMuted} mt-2`}>
								Click to select a file or drag and drop
							</p>
							<p class={`${TEXT.small} ${COLOR.textMuted}`}>PDF, Images, ZIP, TXT up to 10MB</p>
						</div>
					{/if}
				</div>
			</div>

			<div>
				<label
					for="note"
					class={`mb-1.5 block text-xs font-black tracking-widest uppercase ${COLOR.textMuted}`}
				>
					Catatan Tambahan (Opsional)
				</label>
				<textarea
					id="note"
					name="note"
					bind:value={note}
					placeholder="Apa yang Anda pelajari atau kendala yang dihadapi..."
					rows="3"
					class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} resize-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
				></textarea>
			</div>

			{#if errorMessage}
				<div class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
					{errorMessage}
				</div>
			{/if}

			<button
				type="submit"
				disabled={submitting || (!url && !file)}
				class={`w-full ${RADIUS.button} ${COLOR.accentBg} py-3.5 ${TEXT.button} font-bold text-white shadow-lg ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50`}
			>
				{submitting ? 'Mengirim...' : 'Kirim Laporan Progres'}
			</button>
		</form>
	{/if}
</div>
