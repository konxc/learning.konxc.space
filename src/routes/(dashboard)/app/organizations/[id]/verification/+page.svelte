<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import AuthFormField from '$lib/components/AuthFormField.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { enhance } from '$app/forms';
	import { COLOR, RADIUS, TEXT, SPACING, ELEVATION } from '$lib/config/design';
	import { toast } from '$lib/stores/toastStore';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let legalName = $state('');
	let legalType = $state('yayasan');
	let npwp = $state('');
	let skPendirian = $state('');
	let representativeName = $state('');
	let representativePosition = $state('ketua');
	let legalAddress = $state('');
	let city = $state('');
	let province = $state('');
	let postalCode = $state('');
	let isSubmitting = $state(false);
	let processedFormKey = $state('');

	// Show form errors/success as toasts (with guard to prevent re-trigger on navigation)
	$effect(() => {
		const key = `${form?.error ?? ''}${form?.success ?? ''}${form?.message ?? ''}`;
		if (!key || key === processedFormKey) return;
		processedFormKey = key;
		if (form?.error) {
			toast.error(form.error);
		}
		if (form?.success && form?.message) {
			toast.success(form.message);
		}
	});

	const legalTypes = [
		{ value: 'yayasan', label: 'Yayasan' },
		{ value: 'pt', label: 'PT (Perseroan Terbatas)' },
		{ value: 'cv', label: 'CV (Commanditaire Vennootschap)' },
		{ value: 'koperasi', label: 'Koperasi' },
		{ value: 'perorangan', label: 'Perorangan' }
	];

	const positions = [
		{ value: 'ketua', label: 'Ketua' },
		{ value: 'direktur', label: 'Direktur' },
		{ value: 'pemilik', label: 'Pemilik' }
	];

	function getStatusBadge(status: string | null) {
		switch (status) {
			case 'verified':
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
	<title>Verifikasi Organisasi - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Verifikasi Organisasi"
		description="Verifikasi legalitas organisasi untuk mendapatkan badge Trusted."
	/>

	<main class="space-y-6">
		<!-- Status Card -->
		<div
			class={`${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.card}`}
		>
			<div class="flex items-center gap-4">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-full text-white"
					style="background-color: {data.organization?.brandColor || '#4f46e5'}"
				>
					<Icon name="building" size={24} />
				</div>
				<div>
					<h3 class={`${TEXT.h4} ${COLOR.textPrimary}`}>{data.organization?.name}</h3>
					<p class="text-sm text-{statusBadge.color}-600">{statusBadge.text}</p>
				</div>
				{#if data.verification?.status === 'verified'}
					<div class="ml-auto">
						<span
							class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700"
						>
							<Icon name="badge-check" size={12} />
							Trusted Badge
						</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- Verification Form -->
		{#if !data.verification || data.verification.status === 'rejected'}
			<div
				class={`${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} ${ELEVATION.card}`}
			>
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-6`}>Form Verifikasi Legalitas</h3>

				<form
					method="POST"
					action="?/submitVerification"
					use:enhance={() => {
						isSubmitting = true;
						return async ({ update }) => {
							isSubmitting = false;
							await update();
						};
					}}
					class="space-y-6"
				>
					<!-- Legal Name -->
					<AuthFormField
						label="Nama Legal Organisasi"
						name="legalName"
						type="text"
						bind:value={legalName}
						placeholder="Contoh: Yayasan Pendidikan Nusantara"
						required
					/>

					<!-- Legal Type -->
					<div class="space-y-2">
						<label for="legalType" class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}>
							Jenis Legalitas
						</label>
						<select
							id="legalType"
							name="legalType"
							bind:value={legalType}
							class={`w-full ${SPACING.input} ${RADIUS.input} border ${COLOR.cardBorder} bg-zinc-50 outline-hidden transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-zinc-800/50`}
							required
						>
							{#each legalTypes as type}
								<option value={type.value}>{type.label}</option>
							{/each}
						</select>
					</div>

					<!-- NPWP -->
					<AuthFormField
						label="NPWP"
						name="npwp"
						type="text"
						bind:value={npwp}
						placeholder="XX.XXX.XXX.X-XXX.XXX"
						required
					/>

					<!-- SK Pendirian -->
					<AuthFormField
						label="SK Pendirian (URL Document)"
						name="skPendirian"
						type="url"
						bind:value={skPendirian}
						placeholder="https://drive.google.com/..."
					/>

					<div class="border-t pt-6">
						<h4 class={`${TEXT.h4} ${COLOR.textPrimary} mb-4`}>Penanggung Jawab</h4>

						<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
							<AuthFormField
								label="Nama Penanggung Jawab"
								name="representativeName"
								type="text"
								bind:value={representativeName}
								placeholder="Nama lengkap"
								required
							/>

							<div class="space-y-2">
								<label
									for="representativePosition"
									class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}
								>
									Jabatan
								</label>
								<select
									id="representativePosition"
									name="representativePosition"
									bind:value={representativePosition}
									class={`w-full ${SPACING.input} ${RADIUS.input} border ${COLOR.cardBorder} bg-zinc-50 outline-hidden transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:bg-zinc-800/50`}
									required
								>
									{#each positions as pos}
										<option value={pos.value}>{pos.label}</option>
									{/each}
								</select>
							</div>
						</div>
					</div>

					<div class="border-t pt-6">
						<h4 class={`${TEXT.h4} ${COLOR.textPrimary} mb-4`}>Alamat Legal</h4>

						<div class="space-y-4">
							<AuthFormField
								label="Alamat Lengkap"
								name="legalAddress"
								type="text"
								bind:value={legalAddress}
								placeholder="Jalan, nomor, RT/RW, kelurahan, kecamatan"
								required
							/>

							<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
								<AuthFormField
									label="Kota/Kabupaten"
									name="city"
									type="text"
									bind:value={city}
									placeholder="Jakarta"
									required
								/>

								<AuthFormField
									label="Provinsi"
									name="province"
									type="text"
									bind:value={province}
									placeholder="DKI Jakarta"
									required
								/>

								<AuthFormField
									label="Kode Pos"
									name="postalCode"
									type="text"
									bind:value={postalCode}
									placeholder="12345"
								/>
							</div>
						</div>
					</div>

					<div
						class="rounded-lg bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
					>
						<div class="flex gap-2">
							<Icon name="info" size={18} class="mt-0.5 shrink-0" />
							<div>
								<p class="font-medium">Manfaat Verifikasi Organisasi:</p>
								<ul class="mt-1 list-inside list-disc space-y-1">
									<li>Course mendapat badge "Trusted Organization"</li>
									<li>Lebih mudah ditemukan di marketplace</li>
									<li>Membangun kepercayaan dengan calon siswa</li>
									<li>Akses fitur enterprise dan partnership</li>
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
					Verifikasi legalitas organisasi sedang ditinjau oleh admin. Biasanya membutuhkan 3-5 hari
					kerja.
				</p>
			</div>
		{/if}

		<!-- Verified State -->
		{#if data.verification?.status === 'verified'}
			<div
				class={`${RADIUS.card} border-2 border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-800 dark:bg-emerald-900/20`}
			>
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
				>
					<Icon name="badge-check" size={32} />
				</div>
				<h3 class={`${TEXT.h3} text-emerald-800 dark:text-emerald-200`}>
					Organisasi Terverifikasi!
				</h3>
				<p class="mt-2 text-sm text-emerald-700 dark:text-emerald-300">
					Organisasi Anda sekarang memiliki badge Trusted. Semua course akan ditandai sebagai
					verified.
				</p>
			</div>
		{/if}
	</main>
</PageWrapper>
