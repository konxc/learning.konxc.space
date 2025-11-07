<script lang="ts">
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	interface Props {
		courseId: string;
		courseTitle: string;
		existingProof?: { status: string } | null;
	}

	let { courseId, courseTitle, existingProof }: Props = $props();

    let file: File | null = $state(null);
    let error: string | null = $state(null);
    let isUploading: boolean = $state(false);
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
        if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
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

    async function handleSubmit(event: Event) {
        event.preventDefault();
        if (!file) return;

        isUploading = true;
        error = null;

        try {
            // Compress image
            const compressedBase64 = await compressImage(file);

            // Extract base64 data (remove data:image/jpeg;base64, prefix)
            const base64Data = compressedBase64.split(',')[1];

            // Calculate size
            const size = Math.round((base64Data.length * 3) / 4);

            // Create form data
            const formData = new FormData();
            formData.append('courseId', courseId);
            formData.append('dataBase64', base64Data);
            formData.append('mime', file.type);
            formData.append('size', size.toString());

            // Submit
            const response = await fetch('/dashboard/payments', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Upload failed');
            }

            // Success - redirect or show success message
            window.location.href = response.url;
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to upload payment proof';
        } finally {
            isUploading = false;
        }
    }

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
</script>

<div class={`${RADIUS.card} ${COLOR.card} p-8 ${ELEVATION.base}`}>
	<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>Upload Bukti Pembayaran</h3>
	<p class={`${TEXT.body} ${COLOR.textSecondary} mb-5`}>Kursus: {courseTitle}</p>

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
			<p>
				{#if existingProof.status === 'pending'}
					<span
						class={`inline-block ${RADIUS.badge} px-3 py-1 ${TEXT.small} font-semibold ${COLOR.warningBg}`}
						>Sedang ditinjau</span
					>
				{:else if existingProof.status === 'rejected'}
					<span
						class={`inline-block ${RADIUS.badge} px-3 py-1 ${TEXT.small} font-semibold ${COLOR.errorBg}`}
						>Ditolak</span
					>
				{/if}
			</p>
			<p class={`${TEXT.body} ${COLOR.textSecondary} mt-2 text-sm`}>
				Upload ulang untuk mengganti bukti pembayaran
			</p>
		</div>
	{/if}

	<form onsubmit={handleSubmit} class="space-y-5">
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
				Pilih file gambar
			</label>
		</div>

		{#if previewUrl}
			<div class="mb-5 text-center">
				<img
					src={previewUrl}
					alt="Bukti pembayaran"
					class="mx-auto max-h-[400px] max-w-full rounded-lg shadow-md"
				/>
				<button
					type="button"
					onclick={removePreview}
					class={`mt-3 block ${RADIUS.small} bg-red-600 px-4 py-2 ${TEXT.small} font-semibold text-white ${TRANSITION.all} hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600/70 focus-visible:ring-offset-1`}
				>
					Hapus
				</button>
			</div>
		{/if}

		<button
			type="submit"
			disabled={!file || isUploading}
			class={`w-full ${RADIUS.button} bg-linear-to-br from-blue-600 to-purple-600 px-6 py-3 ${TEXT.button} font-semibold text-white ${TRANSITION.all} ${ELEVATION.base} hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0`}
		>
			{isUploading ? 'Mengupload...' : 'Upload Bukti Pembayaran'}
		</button>
	</form>
</div>


