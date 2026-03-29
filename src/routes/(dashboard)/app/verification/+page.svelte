<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import AuthFormField from '$lib/components/AuthFormField.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import AuthMessage from '$lib/components/AuthMessage.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { enhance } from '$app/forms';
	import { COLOR, RADIUS, TEXT, SPACING, ELEVATION, TRANSITION } from '$lib/config/design';
	import { toast } from '$lib/stores/toast';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let ktpNumber = $state('');
	let ktpName = $state('');
	let ktpAddress = $state('');
	let ktpDob = $state('');
	let isSubmitting = $state(false);

	// File inputs
	let ktpPhotoFile = $state<FileList | null>(null);
	let selfieFile = $state<FileList | null>(null);

	let ktpPhotoBase64 = $state('');
	let selfieBase64 = $state('');

	async function fileToBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	async function handleKtpPhotoChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			ktpPhotoBase64 = await fileToBase64(target.files[0]);
		}
	}

	async function handleSelfieChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			selfieBase64 = await fileToBase64(target.files[0]);
		}
	}

	// Status badge
	function getStatusBadge(status: string | null) {
		switch (status) {
			case 'approved':
				return { text: 'Terverifikasi', color: 'emerald', icon: 'check-circle' };
			case 'pending':
				return { text: 'Dalam Proses', color: 'amber', icon: 'clock' };
			case 'rejected':
				return { text: 'Ditolak', color: 'rose', icon: 'x-circle' };
			default:
				return { text: 'Belum Verifikasi', color: 'zinc', icon: 'minus-circle' };
		}
	}

	const statusBadge = $derived(getStatusBadge(data.verification?.status || null));
</script>

<svelte:head>
	<title>Verifikasi KTP - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Verifikasi KTP"
		description="Verifikasi identitas kamu untuk membuka fitur pembuatan organisasi."
	/>

	<main class="space-y-6">
		{#if form?.error}
			<AuthMessage type="error" message={form.error} />
		{/if}

		{#if form?.success}
			<AuthMessage type="success" message={form.message} />
		{/if}

		<!-- Status Card -->
		<div
			class={`${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.card}`}
		>
			<div class="flex items-center gap-4">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-full bg-{statusBadge.color}-500/10 text-{statusBadge.color}-500"
				>
					<Icon name={statusBadge.icon} size={24} />
				</div>
				<div>
					<h3 class={`${TEXT.h4} ${COLOR.textPrimary}`}>Status Verifikasi</h3>
					<p class="text-sm font-medium text-{statusBadge.color}-600">{statusBadge.text}</p>
				</div>
				{#if data.verification?.status === 'approved'}
					<div class="ml-auto">
						<span
							class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700"
						>
							<Icon name="building" size={12} />
							Bisa Buat Organisasi
						</span>
					</div>
				{/if}
			</div>

			{#if data.verification?.status === 'rejected' && data.verification?.rejectionReason}
				<div class="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
					<strong>Alasan Penolakan:</strong>
					{data.verification.rejectionReason}
				</div>
			{/if}
		</div>

		<!-- Verification Form -->
		{#if !data.verification || data.verification.status === 'rejected'}
			<div
				class={`${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.card}`}
			>
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-6`}>Form Verifikasi KTP</h3>

				<form
					method="POST"
					action="?/submitKtp"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							isSubmitting = false;
							await update();
						};
					}}
					class="space-y-6"
				>
					<!-- KTP Number -->
					<AuthFormField
						label="Nomor KTP (NIK)"
						name="ktpNumber"
						type="text"
						bind:value={ktpNumber}
						placeholder="16 digit NIK"
						required
					/>

					<!-- KTP Name -->
					<AuthFormField
						label="Nama Sesuai KTP"
						name="ktpName"
						type="text"
						bind:value={ktpName}
						placeholder="Nama lengkap sesuai KTP"
						required
					/>

					<!-- KTP Address -->
					<div class="space-y-2">
						<label for="ktpAddress" class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}>
							Alamat Sesuai KTP
						</label>
						<textarea
							id="ktpAddress"
							name="ktpAddress"
							bind:value={ktpAddress}
							placeholder="Alamat lengkap sesuai KTP"
							rows="3"
							class={`w-full ${SPACING.input} ${RADIUS.input} border ${COLOR.cardBorder} bg-zinc-50 outline-hidden transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-zinc-800/50`}
							required
						></textarea>
					</div>

					<!-- Date of Birth -->
					<AuthFormField
						label="Tanggal Lahir"
						name="ktpDob"
						type="date"
						bind:value={ktpDob}
						required
					/>

					<!-- KTP Photo -->
					<div class="space-y-2">
						<label class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}>Foto KTP</label>
						<div
							class="rounded-xl border-2 border-dashed {COLOR.cardBorder} p-6 text-center transition-colors hover:border-blue-400"
						>
							{#if ktpPhotoBase64}
								<img src={ktpPhotoBase64} alt="KTP" class="mx-auto h-32 w-auto rounded-lg" />
							{:else}
								<div class="space-y-2">
									<Icon name="camera" size={32} class="mx-auto text-zinc-400" />
									<p class="text-sm text-zinc-500">Upload foto KTP</p>
								</div>
							{/if}
							<input
								type="file"
								accept="image/*"
								class="absolute inset-0 cursor-pointer opacity-0"
								onchange={handleKtpPhotoChange}
								required
							/>
							<input type="hidden" name="ktpPhoto" value={ktpPhotoBase64} />
						</div>
					</div>

					<!-- Selfie with KTP -->
					<div class="space-y-2">
						<label class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}>Selfie dengan KTP</label>
						<div
							class="rounded-xl border-2 border-dashed {COLOR.cardBorder} p-6 text-center transition-colors hover:border-blue-400"
						>
							{#if selfieBase64}
								<img src={selfieBase64} alt="Selfie" class="mx-auto h-32 w-auto rounded-lg" />
							{:else}
								<div class="space-y-2">
									<Icon name="camera" size={32} class="mx-auto text-zinc-400" />
									<p class="text-sm text-zinc-500">Upload selfie memegang KTP</p>
								</div>
							{/if}
							<input
								type="file"
								accept="image/*"
								class="absolute inset-0 cursor-pointer opacity-0"
								onchange={handleSelfieChange}
								required
							/>
							<input type="hidden" name="selfieWithKtp" value={selfieBase64} />
						</div>
					</div>

					<div
						class="rounded-lg bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
					>
						<div class="flex gap-2">
							<Icon name="info" size={18} class="mt-0.5 shrink-0" />
							<div>
								<p class="font-medium">Informasi Penting:</p>
								<ul class="mt-1 list-inside list-disc space-y-1">
									<li>Verifikasi diperlukan untuk membuat organisasi</li>
									<li>Data Anda hanya digunakan untuk verifikasi</li>
									<li>Proses verifikasi membutuhkan 1-3 hari kerja</li>
								</ul>
							</div>
						</div>
					</div>

					<AuthSubmitButton
						text={isSubmitting ? 'Mengirim...' : 'Kirim Verifikasi'}
						disabled={isSubmitting}
					/>
				</form>
			</div>
		{/if}

		<!-- Pending State -->
		{#if data.verification?.status === 'pending'}
			<div
				class={`${RADIUS.card} border-2 border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-800 dark:bg-amber-900/20`}
			>
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600"
				>
					<Icon name="clock" size={32} />
				</div>
				<h3 class={`${TEXT.h3} text-amber-800 dark:text-amber-200`}>Verifikasi Sedang Diproses</h3>
				<p class="mt-2 text-sm text-amber-700 dark:text-amber-300">
					Tim kami sedang memverifikasi data KTP Anda. Proses ini biasanya membutuhkan 1-3 hari
					kerja.
				</p>
			</div>
		{/if}

		<!-- Approved State -->
		{#if data.verification?.status === 'approved'}
			<div
				class={`${RADIUS.card} border-2 border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-800 dark:bg-emerald-900/20`}
			>
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
				>
					<Icon name="check-circle" size={32} />
				</div>
				<h3 class={`${TEXT.h3} text-emerald-800 dark:text-emerald-200`}>KTP Terverifikasi!</h3>
				<p class="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
					Selamat! Anda sekarang dapat membuat organisasi dan mengakses fitur lengkap.
				</p>
				<a
					href="/app/organizations/new"
					class="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-bold text-white transition-colors hover:bg-emerald-700"
				>
					<Icon name="building" size={18} />
					Buat Organisasi
				</a>
			</div>
		{/if}
	</main>
</PageWrapper>
