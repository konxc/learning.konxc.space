<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import { COLOR, TEXT, RADIUS, TRANSITION, SPACING } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import AuthFormField from '$lib/components/AuthFormField.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import { toast } from '$lib/stores/toastStore';
	import { formToast } from '$lib/utils/formEnhance';

	interface SettingsPreferences {
		emailNotif: boolean;
		waNotif: boolean;
		focusMode: boolean;
	}

	interface OrganizationApiKey {
		id: string;
		name: string;
		status: string;
		lastUsedAt: Date | null;
		createdAt: Date;
	}

	interface Organization {
		id: string;
		name: string;
		slug: string;
		brandColor: string | null;
		logoUrl: string | null;
	}

	interface SettingsPageData {
		user: {
			id: string;
			username: string;
			fullName: string | null;
			email: string | null;
			phone: string | null;
			avatarUrl: string | null;
			role: string;
			createdAt: Date;
			isVerified: boolean;
		};
		verification: any; // Using any or specific type for simplicity
		organization: Organization | null;
		orgMembers: unknown[];
		orgApiKeys: OrganizationApiKey[];
		isOrgAdmin: boolean;
		headerTabs: {
			tabs: Array<{ label: string; id: string; icon: string }>;
			activeTab: string;
		};
		preferences: SettingsPreferences;
	}

	let { data, form }: { data: SettingsPageData; form?: ActionData } = $props();

	let activeTab = $derived(data.headerTabs.activeTab);
	let isOrgAdmin = $derived(data.isOrgAdmin);

	// Modals & States
	let showApiKeyModal = $state(false);
	let generatedKey = $state('');
	let newKeyName = $state('');

	let showDeleteModal = $state(false);
	let deleteConfirmText = $state('');

	let newOrgName = $state('');
	let newOrgSlug = $state('');

	// Preferences toggles state - initialize from server data
	let emailNotif = $state(data.preferences?.emailNotif ?? true);
	let waNotif = $state(data.preferences?.waNotif ?? false);
	let focusMode = $state(data.preferences?.focusMode ?? true);
	let submittingPref = $state<string | null>(null);

	// Avatar uploader
	let avatarForm: HTMLFormElement | undefined = $state();
	let avatarInput: HTMLInputElement | undefined = $state();
	let isUploadingAvatar = $state(false);

	// KYC UI State
	let ktpFileName = $state<string | null>(null);
	let selfieFileName = $state<string | null>(null);

	$effect(() => {
		if (form?.success && form?.data && 'key' in form.data) {
			generatedKey = (form.data as { key: string }).key;
			showApiKeyModal = true;
		}
	});

	function toggleEmail() {
		if (submittingPref) return;
		emailNotif = !emailNotif;
		submittingPref = 'email';
		(document.getElementById('emailNotifForm') as HTMLFormElement)?.requestSubmit();
	}

	function toggleWA() {
		if (submittingPref) return;
		waNotif = !waNotif;
		submittingPref = 'wa';
		(document.getElementById('waNotifForm') as HTMLFormElement)?.requestSubmit();
	}

	function toggleFocus() {
		if (submittingPref) return;
		focusMode = !focusMode;
		submittingPref = 'focus';
		(document.getElementById('focusModeForm') as HTMLFormElement)?.requestSubmit();
	}

	function maskKey(key: string): string {
		if (!key || key.length < 12) return key;
		return key.substring(0, 8) + '••••••••••••' + key.substring(key.length - 4);
	}
</script>

<PageWrapper>
	<PageHeader title="Pengaturan Akun" />
	<div class="mx-auto max-w-6xl">
		<main>
			<!-- Profile Tab -->
			{#if activeTab === 'profile'}
				<div class="animate-in grid gap-10 md:grid-cols-3">
					<div class="space-y-6 md:col-span-1">
						<div
							class={`p-8 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} flex flex-col items-center text-center transition-all hover:scale-[1.02]`}
						>
							<div class="relative mb-6">
								<form
									method="POST"
									action="?/uploadAvatar"
									enctype="multipart/form-data"
									bind:this={avatarForm}
									use:enhance={() => {
										isUploadingAvatar = true;
										return async ({ result, update }) => {
											isUploadingAvatar = false;
											if (result.type === 'success') {
												toast.success(
													(result.data as any)?.message || 'Avatar berhasil diperbarui!'
												);
												await update();
											} else if (result.type === 'failure') {
												toast.error((result.data as any)?.error || 'Gagal mengunggah avatar');
											}
										};
									}}
								>
									<input
										type="file"
										name="avatar"
										accept="image/png, image/jpeg, image/webp"
										class="hidden"
										bind:this={avatarInput}
										onchange={() => avatarForm?.requestSubmit()}
									/>
									<button
										type="button"
										onclick={() => avatarInput?.click()}
										disabled={isUploadingAvatar}
										class="group relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-blue-500/20 bg-blue-100 p-1 text-blue-600 transition-colors hover:border-blue-500 dark:bg-zinc-800 dark:text-blue-400"
									>
										{#if data.user.avatarUrl}
											<img
												src={data.user.avatarUrl}
												alt="Avatar"
												class={`h-full w-full rounded-full object-cover transition-all duration-500 ${isUploadingAvatar ? 'scale-110 opacity-20 blur-sm' : 'opacity-100'}`}
											/>
										{:else}
											<Icon
												name="user"
												size={80}
												class={`opacity-40 transition-all ${isUploadingAvatar ? 'scale-50 opacity-0' : ''}`}
											/>
										{/if}

										{#if isUploadingAvatar}
											<div
												class="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm"
											>
												<Icon
													name="loader-2"
													size={32}
													class="animate-spin text-blue-600 dark:text-blue-400"
												/>
											</div>
										{:else}
											<div
												class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100"
											>
												<Icon
													name="camera"
													size={32}
													class="scale-75 text-white transition-transform group-hover:scale-100"
												/>
											</div>
										{/if}
									</button>
								</form>

								{#if data.user.isVerified}
									<div
										class="pointer-events-none absolute -right-1 -bottom-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-xl dark:border-zinc-900"
										title="Terverifikasi"
									>
										<Icon name="check" size={18} />
									</div>
								{/if}
							</div>
							<h2 class="mb-1 text-2xl font-black tracking-tighter uppercase italic">
								{data.user.fullName || data.user.username}
							</h2>
							<p
								class="rounded-full border border-zinc-200 bg-zinc-100 px-4 py-1.5 text-xs font-bold tracking-widest text-zinc-500 uppercase dark:border-zinc-700 dark:bg-zinc-800"
							>
								{data.user.role}
							</p>
						</div>

						<div
							class={`p-6 ${RADIUS.card} ${COLOR.card} space-y-4 border border-zinc-100 dark:border-zinc-800`}
						>
							<div
								class="flex items-center justify-between text-xs font-bold tracking-tighter text-zinc-400 uppercase"
							>
								<span>Status Akun</span>
								<span class={data.user.isVerified ? 'text-green-500' : 'text-orange-500'}>
									{data.user.isVerified ? 'Institusi' : 'Personal'}
								</span>
							</div>
							<div class="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
								<div
									class="h-full bg-blue-600"
									style="width: {data.user.isVerified ? '100%' : '30%'}"
								></div>
							</div>
							<p class="text-[10px] leading-relaxed text-zinc-500 italic">
								{#if data.user.isVerified}
									Anda memiliki akses penuh untuk membuat organisasi dan mendeploy draf agen.
								{:else}
									Verifikasi KTP Anda untuk mengaktifkan fitur Organisasi & Agentic Deployment.
								{/if}
							</p>
						</div>
					</div>

					<div class="md:col-span-2">
						<form
							method="POST"
							action="?/updateProfile"
							use:enhance={formToast({
								success: 'Profil berhasil diperbarui!',
								error: 'Gagal memperbarui profil',
								withUpdate: false
							})}
							class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} relative space-y-8 overflow-hidden shadow-sm`}
						>
							<div class="pointer-events-none absolute top-0 right-0 p-4 opacity-5">
								<Icon name="user" size={120} />
							</div>
							<h3
								class="mb-4 border-l-4 border-blue-600 pl-4 text-xl font-black tracking-widest uppercase italic"
							>
								Informasi Dasar
							</h3>
							<AuthFormField
								label="Nama Lengkap"
								name="fullName"
								value={data.user.fullName ?? undefined}
								placeholder="Masukkan nama lengkap Anda"
							/>
							<div class="grid gap-6 md:grid-cols-2">
								<AuthFormField
									label="Alamat Email"
									name="email"
									value={data.user.email ?? undefined}
									placeholder="email@contoh.com"
									required
								/>
								<AuthFormField
									label="Nomor Telepon"
									name="phone"
									value={data.user.phone ?? undefined}
									placeholder="628..."
								/>
							</div>
							<div class="flex justify-end border-t border-zinc-100 pt-6 dark:border-zinc-800">
								<AuthSubmitButton text="Simpan Perubahan" />
							</div>
						</form>
					</div>
				</div>
			{/if}

			<!-- Verification (Trust & Safety) Tab -->
			{#if activeTab === 'verification'}
				<div class="animate-in mx-auto max-w-3xl space-y-8">
					{#if data.user.isVerified}
						<div
							class={`p-10 ${RADIUS.card} ${COLOR.card} flex flex-col items-center border-2 border-green-200 text-center shadow-xl dark:border-green-900/50`}
						>
							<div
								class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30"
							>
								<Icon name="shield-check" size={48} />
							</div>
							<h3
								class="mb-2 text-2xl font-black tracking-tighter text-green-700 uppercase italic dark:text-green-400"
							>
								Identitas Terverifikasi
							</h3>
							<p class="mb-6 max-w-md text-sm font-medium text-zinc-500">
								Terima kasih! Akun Anda telah lolos standar KYC institusional platform Naik Kelas.
								Anda sekarang memiliki akses penuh untuk menjadi Mentor, Fasilitator, dan mengelola
								agen organisasi.
							</p>
							<div class="grid w-full max-w-sm grid-cols-2 gap-4 text-left">
								<div
									class="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800/50 dark:bg-zinc-800/50"
								>
									<p class="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
										Nama Sesuai KTP
									</p>
									<p class="mt-1 text-sm font-bold">{data.verification?.ktpName || '-'}</p>
								</div>
								<div
									class="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800/50 dark:bg-zinc-800/50"
								>
									<p class="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
										Tanggal Disetujui
									</p>
									<p class="mt-1 text-sm font-bold">
										{data.verification?.verifiedAt
											? new Date(data.verification.verifiedAt).toLocaleDateString('id-ID')
											: '-'}
									</p>
								</div>
							</div>
						</div>
					{:else if data.verification?.status === 'pending'}
						<div
							class={`p-10 ${RADIUS.card} ${COLOR.card} flex flex-col items-center border-2 border-blue-200 text-center shadow-xl dark:border-blue-900/50`}
						>
							<div
								class="mb-6 flex h-24 w-24 animate-pulse items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30"
							>
								<Icon name="clock" size={48} />
							</div>
							<h3
								class="mb-2 text-2xl font-black tracking-tighter text-blue-700 uppercase italic dark:text-blue-400"
							>
								Menunggu Peninjauan
							</h3>
							<p class="max-w-md text-sm font-medium text-zinc-500">
								Data KYC Anda telah kami terima dan sedang diproses oleh Tim Kepatuhan. Proses
								verifikasi biasanya memakan waktu 1x24 jam kerja.
							</p>
						</div>
					{:else}
						<form
							method="POST"
							action="?/submitVerification"
							enctype="multipart/form-data"
							use:enhance={formToast({
								success: 'Data verifikasi berhasil dikirim!',
								error: 'Gagal mengirim verifikasi',
								withUpdate: false
							})}
							class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} relative space-y-8 shadow-sm`}
						>
							<div class="pointer-events-none absolute top-0 right-0 p-4 opacity-5">
								<Icon name="shield-check" size={120} />
							</div>

							<div>
								<h3
									class="mb-2 border-l-4 border-blue-600 pl-4 text-xl font-black tracking-widest uppercase italic"
								>
									Verifikasi KTP (KYC)
								</h3>
								<p class="mb-6 max-w-lg text-sm text-zinc-500">
									Informasi ini wajib dilengkapi untuk standar kepatuhan platform SaaS. Data Anda
									dienkripsi dan diproses sesuai kebijakan privasi kami.
								</p>

								{#if data.verification?.status === 'rejected'}
									<div
										class="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900/50 dark:bg-red-950/30"
									>
										<p class="mb-1 flex items-center gap-2 font-bold">
											<Icon name="alert-triangle" size={16} /> Verifikasi Ditolak
										</p>
										<p class="text-xs opacity-90">
											{data.verification?.rejectionReason ||
												'Data KTP tidak valid atau foto buram. Silakan gunakan kartu identitas fisik asli dan coba kembali.'}
										</p>
									</div>
								{/if}
							</div>

							<div class="grid gap-6 md:grid-cols-2">
								<AuthFormField
									label="Nomor Induk Kependudukan (NIK)"
									name="ktpNumber"
									placeholder="16 Digit Angka"
									value={data.verification?.ktpNumber}
									required
								/>
								<AuthFormField
									label="Nama Sesuai KTP"
									name="ktpName"
									placeholder="HURUF KAPITAL"
									value={data.verification?.ktpName}
									required
								/>
							</div>

							<div class="grid gap-6 md:grid-cols-2">
								<AuthFormField
									label="Tanggal Lahir"
									name="ktpDob"
									type="date"
									value={data.verification?.ktpDob
										? new Date(data.verification.ktpDob).toISOString().split('T')[0]
										: ''}
									required
								/>
								<div class="col-span-1 md:col-span-2">
									<AuthFormField
										label="Alamat Sesuai KTP"
										name="ktpAddress"
										placeholder="Jl. Merdeka No. 1..."
										value={data.verification?.ktpAddress}
										required
									/>
								</div>
							</div>

							<div
								class="grid gap-6 border-t border-zinc-100 pt-4 md:grid-cols-2 dark:border-zinc-800"
							>
								<!-- Real Upload Dropzones -->
								<div class="space-y-2">
									<label for="ktpPhoto" class="block text-xs font-black tracking-widest text-zinc-400 uppercase"
										>Foto KTP Asli</label
									>
									<div
										class="group relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition-colors hover:border-blue-500 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50"
									>
										<Icon
											name="upload"
											class="mb-2 text-zinc-400 transition-colors group-hover:text-blue-500"
										/>
										<span
											class="text-xs font-bold transition-colors {ktpFileName ? 'text-blue-600' : 'text-zinc-500 group-hover:text-blue-600'}"
											>{ktpFileName || 'Pilih File KTP'}</span
										>
										<input
											id="ktpPhoto"
											type="file"
											name="ktpPhoto"
											accept="image/png, image/jpeg, image/jpg"
											required
											class="absolute inset-0 cursor-pointer opacity-0"
											onchange={(e) => {
												const files = (e.target as HTMLInputElement).files;
												ktpFileName = files && files.length > 0 ? files[0].name : null;
											}}
										/>
									</div>
									<p class="text-[10px] text-zinc-400">Maks. 5MB, format JPG/PNG/JPEG.</p>
								</div>

								<div class="space-y-2">
									<label for="selfiePhoto" class="block text-xs font-black tracking-widest text-zinc-400 uppercase"
										>Selfie dengan KTP</label
									>
									<div
										class="group relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition-colors hover:border-blue-500 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/50"
									>
										<Icon
											name="upload"
											class="mb-2 text-zinc-400 transition-colors group-hover:text-blue-500"
										/>
										<span
											class="text-xs font-bold transition-colors {selfieFileName ? 'text-blue-600' : 'text-zinc-500 group-hover:text-blue-600'}"
											>{selfieFileName || 'Pilih File Selfie'}</span
										>
										<input
											id="selfiePhoto"
											type="file"
											name="selfiePhoto"
											accept="image/png, image/jpeg, image/jpg"
											required
											class="absolute inset-0 cursor-pointer opacity-0"
											onchange={(e) => {
												const files = (e.target as HTMLInputElement).files;
												selfieFileName = files && files.length > 0 ? files[0].name : null;
											}}
										/>
									</div>
									<p class="text-[10px] text-zinc-400">Pastikan wajah dan KTP terlihat jelas.</p>
								</div>
							</div>

							<div
								class="flex items-center justify-end gap-4 border-t border-zinc-100 pt-6 dark:border-zinc-800"
							>
								<p
									class="mr-4 max-w-xs text-right text-xs leading-relaxed tracking-tight text-zinc-500 italic"
								>
									Dengan menekan tombol submit, Anda menyetujui validasi identitas dan ketentuan
									layanan kami.
								</p>
								<AuthSubmitButton text="Submit Dokumen" />
							</div>
						</form>
					{/if}
				</div>
			{/if}

			<!-- Security Tab -->
			{#if activeTab === 'security'}
				<div class="animate-in mx-auto max-w-2xl">
					<form
						method="POST"
						action="?/changePassword"
						use:enhance={formToast({
							success: 'Password berhasil diubah!',
							error: 'Gagal mengubah password',
							withUpdate: false
						})}
						class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} relative space-y-8 shadow-sm`}
					>
						<div class="pointer-events-none absolute top-0 right-0 p-4 opacity-5">
							<Icon name="shield" size={120} />
						</div>
						<h3
							class="mb-4 border-l-4 border-blue-600 pl-4 text-xl font-black tracking-widest uppercase italic"
						>
							Keamanan Akun
						</h3>
						<AuthFormField
							label="Password Saat Ini"
							name="currentPassword"
							type="password"
							placeholder="••••••••"
							required
						/>
						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<AuthFormField
								label="Password Baru"
								name="newPassword"
								type="password"
								placeholder="••••••••"
								required
							/>
							<AuthFormField
								label="Konfirmasi Password"
								name="confirmPassword"
								type="password"
								placeholder="••••••••"
								required
							/>
						</div>
						<div class="flex justify-end border-t border-zinc-100 pt-6 dark:border-zinc-800">
							<AuthSubmitButton text="Perbarui Password" />
						</div>
					</form>
				</div>
			{/if}

			<!-- Organization Tab -->
			{#if activeTab === 'organization'}
				<div class="animate-in space-y-10">
					{#if !data.organization}
						<div
							class={`mx-auto max-w-3xl border-2 border-dashed ${COLOR.cardBorder} ${RADIUS.card} p-12 text-center`}
						>
							<div class="mb-6 flex justify-center">
								<div class="rounded-full bg-zinc-100 p-6 dark:bg-zinc-800">
									<Icon name="layout" size={48} class="text-zinc-400" />
								</div>
							</div>
							<h3 class="mb-2 text-2xl font-black tracking-tight uppercase italic">
								Belum Ada Organisasi
							</h3>
							<p class="mx-auto mb-10 max-w-md text-zinc-500">
								Buat organisasi untuk mulai mendeploy kurikulum melalui AI Agent dan mengelola tim
								Anda secara profesional.
							</p>

							{#if data.user.isVerified || data.user.role === 'admin'}
								<form
									method="POST"
									action="?/createOrganization"
									use:enhance={formToast({
										success: 'Organisasi berhasil dibuat!',
										error: 'Gagal membuat organisasi',
										withUpdate: false
									})}
									class="mx-auto max-w-lg space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-left dark:border-zinc-800 dark:bg-zinc-900/50"
								>
									<AuthFormField
										label="Nama Organisasi"
										name="name"
										bind:value={newOrgName}
										placeholder="Contoh: Yayasan Klub Fisika"
										required
									/>
									<div>
										<label
											for="org-slug"
											class={`${TEXT.small} mb-1 block font-bold transition-all duration-300`}
											>Workspace URL</label
										>
										<div class="flex items-center gap-2">
											<span class="text-xs text-zinc-400">naikkelas.id/org/</span>
											<input
												id="org-slug"
												type="text"
												name="slug"
												bind:value={newOrgSlug}
												required
												pattern="[a-z0-9-]+"
												placeholder="klub-fisika"
												class={`flex-1 border-b-2 border-zinc-200 bg-transparent py-2 text-sm font-black transition-all outline-none focus:border-blue-600 dark:border-zinc-800`}
											/>
										</div>
									</div>
									<div class="pt-4">
										<AuthSubmitButton text="Buat Organisasi Sekarang" />
									</div>
								</form>
							{:else}
								<div
									class="animate-pulse-slow relative mx-auto max-w-lg overflow-hidden rounded-2xl border-2 border-dashed border-zinc-200 bg-white/50 p-10 text-center dark:border-zinc-800 dark:bg-zinc-900/30"
								>
									<div
										class="pointer-events-none absolute inset-0 z-0 bg-blue-500/5 backdrop-blur-3xl"
									></div>
									<div class="relative z-10">
										<div
											class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-inner dark:bg-blue-900/30"
										>
											<Icon name="lock" size={32} />
										</div>
										<h4
											class="mb-3 text-2xl font-black tracking-tight text-zinc-900 uppercase italic dark:text-white"
										>
											Akses Terkunci
										</h4>
										<p
											class="mx-auto mb-8 max-w-xs text-sm leading-relaxed font-medium text-zinc-500"
										>
											Demi kepatuhan standar <span
												class="font-bold text-zinc-800 dark:text-zinc-200"
												>Naik Kelas Enterprise</span
											>, manajemen Workspace diwajibkan melakukan validasi *Know Your Customer*
											(KYC).
										</p>
										<a
											href="?tab=verification"
											class={`inline-block ${RADIUS.button} bg-black px-10 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl transition-all hover:scale-105 hover:bg-blue-600 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-blue-500 dark:hover:text-white`}
										>
											Verifikasi Akun Sekarang <Icon
												name="arrow-right"
												size={14}
												class="ml-1 inline"
											/>
										</a>
									</div>
								</div>
							{/if}
						</div>
					{:else}
						<!-- Organization Info & Settings -->
						<div class="grid gap-8 lg:grid-cols-2">
							<section
								class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} space-y-6 shadow-sm`}
							>
								<div class="flex items-center justify-between">
									<h3
										class="border-l-4 border-blue-600 pl-4 text-xl font-black tracking-widest uppercase italic"
									>
										Pengaturan Organisasi
									</h3>
									<div
										class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-zinc-100 font-black text-blue-600 dark:bg-zinc-800"
									>
										{data.organization.name?.[0]?.toUpperCase()}
									</div>
								</div>
								<form
									method="POST"
									action="?/updateOrgSettings"
									use:enhance={formToast({
										success: 'Pengaturan organisasi diperbarui!',
										error: 'Gagal memperbarui pengaturan',
										withUpdate: false
									})}
									class="space-y-6"
								>
									<AuthFormField
										label="Nama Institusi"
										name="name"
										value={data.organization.name}
										required
									/>
									<div class="space-y-2">
										<label
											for="brand-color"
											class="text-xs font-bold tracking-widest text-zinc-400 uppercase"
											>Branding Color</label
										>
										<div class="flex items-center gap-4">
											<input
												id="brand-color"
												type="color"
												name="brandColor"
												value={data.organization.brandColor}
												class="h-12 w-12 cursor-pointer rounded-xl border-none bg-transparent"
											/>
											<span class="font-mono text-sm uppercase">{data.organization.brandColor}</span
											>
										</div>
									</div>
									{#if isOrgAdmin}
										<div class="border-t border-zinc-100 pt-6 dark:border-zinc-800">
											<AuthSubmitButton text="Update Organisasi" />
										</div>
									{/if}
								</form>
							</section>

							<!-- API Key Section -->
							<section
								class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} flex flex-col space-y-6 shadow-sm`}
							>
								<div class="flex items-center justify-between">
									<h3
										class="border-l-4 border-green-600 pl-4 text-xl font-black tracking-widest uppercase italic"
									>
										Agent Deployment API
									</h3>
									<Icon name="key" class="text-green-600" />
								</div>
								<p class="mb-4 text-sm text-zinc-500">
									Gunakan API Key untuk mengizinkan AI Agent (naikkelas-agent) melakukan deployment
									kurikulum secara otomatis.
								</p>

								<div class="flex-1 space-y-4">
									{#each data.orgApiKeys as key}
										<div
											class="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50"
										>
											<div>
												<p class="text-sm font-bold">{key.name}</p>
												<p class="font-mono text-[10px] text-zinc-400 italic">
													Terakhir digunakan: {key.lastUsedAt
														? new Date(key.lastUsedAt).toLocaleDateString()
														: 'Belum pernah'}
												</p>
											</div>
											{#if key.status === 'active'}
												<form method="POST" action="?/revokeApiKey">
													<input type="hidden" name="keyId" value={key.id} />
													<button
														class="text-xs font-bold tracking-widest text-red-600 uppercase hover:underline"
														>Revoke</button
													>
												</form>
											{:else}
												<span class="text-xs font-bold tracking-widest text-zinc-400 uppercase"
													>Revoked</span
												>
											{/if}
										</div>
									{:else}
										<div
											class="flex flex-col items-center justify-center h-40 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl"
										>
											<p class="text-xs font-bold text-zinc-400 uppercase italic">
												Belum ada API Key
											</p>
										</div>
									{/each}
								</div>

								{#if isOrgAdmin}
									<button
										onclick={() => (showApiKeyModal = true)}
										class={`mt-4 w-full py-4 ${RADIUS.button} bg-zinc-900 text-xs font-black tracking-widest text-white uppercase shadow-lg transition-all hover:bg-black`}
									>
										Buat API Key Baru
									</button>
								{/if}
							</section>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Preferences Tab -->
			{#if activeTab === 'preferences'}
				<!-- Hidden forms for preference updates -->
				<form
					method="POST"
					action="?/updatePreferences"
					id="emailNotifForm"
					use:enhance={() => {
						return async ({ result }) => {
							submittingPref = null;
							if (result.type === 'failure') {
								emailNotif = !emailNotif;
								toast.error('Gagal menyimpan preferensi');
							} else {
								toast.success('Notifikasi email ' + (emailNotif ? 'diaktifkan' : 'dinonaktifkan'));
							}
						};
					}}
					class="hidden"
				>
					<input type="hidden" name="emailNotif" value={emailNotif.toString()} />
				</form>
				<form
					method="POST"
					action="?/updatePreferences"
					id="waNotifForm"
					use:enhance={() => {
						return async ({ result }) => {
							submittingPref = null;
							if (result.type === 'failure') {
								waNotif = !waNotif;
								toast.error('Gagal menyimpan preferensi');
							} else {
								toast.success('Notifikasi WhatsApp ' + (waNotif ? 'diaktifkan' : 'dinonaktifkan'));
							}
						};
					}}
					class="hidden"
				>
					<input type="hidden" name="waNotif" value={waNotif.toString()} />
				</form>
				<form
					method="POST"
					action="?/updatePreferences"
					id="focusModeForm"
					use:enhance={() => {
						return async ({ result }) => {
							submittingPref = null;
							if (result.type === 'success') {
								toast.success(focusMode ? 'Modus Fokus diaktifkan' : 'Modus Fokus dinonaktifkan');
							} else if (result.type === 'failure') {
								focusMode = !focusMode;
								toast.error('Gagal menyimpan preferensi');
							}
						};
					}}
					class="hidden"
				>
					<input type="hidden" name="focusMode" value={focusMode.toString()} />
				</form>

				<div class="animate-in grid gap-8 md:grid-cols-3">
					<div class="space-y-8 md:col-span-2">
						<section
							class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} relative space-y-6`}
						>
							<h3
								class="mb-4 border-l-4 border-blue-600 pl-4 text-xl font-black tracking-widest uppercase italic"
							>
								Pengaturan Aplikasi
							</h3>

							<div class="space-y-6">
								<div
									class="flex items-center justify-between border-b border-zinc-100 py-4 dark:border-zinc-800"
								>
									<div>
										<h4 class="font-bold">Notifikasi Email</h4>
										<p class="text-xs text-zinc-500 italic">
											Terima laporan mingguan progres belajar peserta.
										</p>
									</div>
									<button
										onclick={toggleEmail}
										aria-label={emailNotif
											? 'Nonaktifkan notifikasi email'
											: 'Aktifkan notifikasi email'}
										disabled={submittingPref !== null}
										class={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${emailNotif ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'} ${submittingPref !== null ? 'cursor-not-allowed opacity-50' : ''}`}
									>
										<span
											class={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${emailNotif ? 'translate-x-6' : 'translate-x-1'}`}
										></span>
									</button>
								</div>

								<div
									class="flex items-center justify-between border-b border-zinc-100 py-4 dark:border-zinc-800"
								>
									<div>
										<h4 class="font-bold">Notifikasi WhatsApp</h4>
										<p class="text-xs text-zinc-500 italic">
											Terima alert instan saat ada tugas baru dikirim.
										</p>
									</div>
									<button
										onclick={toggleWA}
										aria-label={waNotif
											? 'Nonaktifkan notifikasi WhatsApp'
											: 'Aktifkan notifikasi WhatsApp'}
										disabled={submittingPref !== null}
										class={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${waNotif ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'} ${submittingPref !== null ? 'cursor-not-allowed opacity-50' : ''}`}
									>
										<span
											class={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${waNotif ? 'translate-x-6' : 'translate-x-1'}`}
										></span>
									</button>
								</div>

								<div class="flex items-center justify-between py-4">
									<div>
										<h4 class="font-bold">Modus Fokus (LMS)</h4>
										<p class="text-xs text-zinc-500 italic">
											Sembunyikan sidebar otomatis saat sedang belajar.
										</p>
									</div>
									<button
										onclick={toggleFocus}
										aria-label={focusMode ? 'Nonaktifkan modus fokus' : 'Aktifkan modus fokus'}
										disabled={submittingPref !== null}
										class={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${focusMode ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'} ${submittingPref !== null ? 'cursor-not-allowed opacity-50' : ''}`}
									>
										<span
											class={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${focusMode ? 'translate-x-6' : 'translate-x-1'}`}
										></span>
									</button>
								</div>
							</div>
						</section>
					</div>

					<div class="space-y-6">
						<div
							class={`p-8 ${RADIUS.card} group relative overflow-hidden bg-linear-to-br from-blue-600 to-indigo-700 text-white shadow-xl`}
						>
							<Icon
								name="zap"
								class="absolute -right-4 -bottom-4 opacity-10 transition-transform duration-1000 group-hover:scale-150"
								size={140}
							/>
							<h4 class="mb-2 text-lg font-black tracking-tighter uppercase italic">Tips</h4>
							<p class="text-xs leading-relaxed font-medium italic opacity-80">
								Pengaturan ini membantu Anda mengatur kenyamanan saat berinteraksi dengan platform
								Naik Kelas.
							</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Payment Gateway (Admin Only) -->
			{#if activeTab === 'payments' && data.user.role === 'admin'}
				<div class="animate-in space-y-8">
					<section
						class={`p-10 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} space-y-6`}
					>
						<div class="mb-4 flex items-center gap-4">
							<Icon name="credit-card" class="text-blue-600" size={32} />
							<div>
								<h3 class="text-xl font-black tracking-widest uppercase italic">
									Midtrans Snap Configuration
								</h3>
								<p class="text-xs text-zinc-500 italic">Hanya dapat diakses oleh Platform Admin.</p>
							</div>
						</div>

						<div class="grid gap-6 md:grid-cols-2">
							<AuthFormField
								label="Client Key"
								name="midtransClientKey"
								value="••••••••••••••••••••"
								readonly
							/>
							<AuthFormField
								label="Server Key"
								name="midtransServerKey"
								value="••••••••••••••••••••"
								readonly
							/>
						</div>
						<div
							class="rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20"
						>
							<p class="text-xs font-bold text-blue-800 dark:text-blue-300">💡 Integrasi Aktif</p>
							<p class="mt-1 text-[10px] text-blue-700 italic">
								Sistem pembayaran menggunakan Midtrans Snap v1.0. Konfigurasi didefinisikan melalui
								environment variables server.
							</p>
						</div>
					</section>
				</div>
			{/if}

			<!-- Account / Danger Tab -->
			{#if activeTab === 'account'}
				<div class="animate-in mx-auto max-w-2xl">
					<div
						class={`p-10 ${RADIUS.card} relative space-y-6 overflow-hidden border-2 border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30`}
					>
						<div class="pointer-events-none absolute top-0 right-0 p-4 text-red-600 opacity-10">
							<Icon name="trash-2" size={120} />
						</div>
						<div class="flex items-start gap-4">
							<div
								class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-red-600 shadow-lg"
							>
								<Icon name="alert-triangle" size={24} />
							</div>
							<div class="flex-1">
								<h3
									class="mb-2 text-xl font-black tracking-widest text-red-800 uppercase italic dark:text-red-300"
								>
									Hapus Seluruh Data
								</h3>
								<p class="mb-6 text-sm leading-relaxed text-red-700 italic dark:text-red-400">
									Penghapusan akun bersifat final. Semua riwayat belajar, sertifikat, dan akses ke
									organisasi akan hilang selamanya dan tidak dapat dipulihkan oleh tim support.
								</p>
								<button
									onclick={() => (showDeleteModal = true)}
									class={`w-full md:w-auto ${RADIUS.button} bg-red-600 px-10 py-4 text-xs font-black tracking-widest text-white uppercase shadow-xl transition-all hover:scale-105 hover:bg-red-700 active:scale-95`}
									>Mulai Penghapusan Akun</button
								>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</main>
	</div>

	<!-- API Key Modal -->
	{#if showApiKeyModal}
		<div
			class="animate-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
		>
			<div
				class={`w-full max-w-lg ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} relative p-10 shadow-2xl`}
			>
				<div class="mb-8 flex items-center justify-between">
					<h3
						class="border-l-4 border-green-600 pl-4 text-2xl font-black tracking-tighter uppercase italic"
					>
						Agent Secret Key
					</h3>
					<button
						onclick={() => {
							showApiKeyModal = false;
							generatedKey = '';
						}}
						class="text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white"
						><Icon name="x" size={24} /></button
					>
				</div>

				{#if generatedKey}
					<div class="space-y-6">
						<div
							class="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/20"
						>
							<p
								class="flex items-center gap-2 text-xs font-bold tracking-widest text-green-700 uppercase italic"
							>
								<Icon name="alert-circle" size={14} />
								Sangat Penting!
							</p>
							<p class="mt-1 text-[10px] text-green-600">
								Salin key ini sekarang. Demi keamanan, kami tidak akan menampilkannya lagi setelah
								Anda menutup jendela ini.
							</p>
						</div>

						<div
							class="group relative flex items-center gap-4 rounded-xl border-2 border-zinc-200 bg-zinc-50 p-6 font-mono text-lg dark:border-zinc-700 dark:bg-zinc-800"
						>
							<span class="flex-1 truncate tracking-tighter select-all"
								>{maskKey(generatedKey)}</span
							>
							<button
								onclick={() => {
									navigator.clipboard.writeText(generatedKey);
									toast.success('Key disalin ke clipboard!');
								}}
								class="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-900 shadow-sm transition-all hover:bg-zinc-900 hover:text-white dark:border-zinc-600 dark:bg-zinc-900"
							>
								<Icon name="copy" size={16} />
							</button>
						</div>

						<button
							onclick={() => {
								showApiKeyModal = false;
								generatedKey = '';
							}}
							class={`w-full py-4 ${RADIUS.button} bg-zinc-900 text-xs font-black tracking-widest text-white uppercase shadow-xl transition-all active:scale-95 dark:bg-white dark:text-black`}
						>
							Saya Sudah Mendokumentasikan Key Ini
						</button>
					</div>
				{:else}
					<form
						method="POST"
						action="?/createApiKey"
						use:enhance={() => {
							return async ({ result }) => {
								if (result.type === 'failure') {
									const errorMsg = (result.data as any)?.error || 'Gagal membuat API Key';
									toast.error(errorMsg);
								}
								// Success case is handled by $effect that shows the modal
							};
						}}
						class="space-y-6"
					>
						<AuthFormField
							label="Identitas Key"
							name="name"
							bind:value={newKeyName}
							placeholder="Contoh: Production Agent ASIB"
							required
						/>
						<p class="text-[10px] text-zinc-400 italic">
							Key ini akan memberikan akses penuh bagi agen untuk mengelola kurikulum di organisasi {data
								.organization?.name}.
						</p>
						<div class="flex justify-end pt-4">
							<AuthSubmitButton text="Generate Secret Key" />
						</div>
					</form>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Delete Modal -->
	{#if showDeleteModal}
		<div
			class="animate-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
		>
			<div
				class={`w-full max-w-md ${RADIUS.card} border-2 border-red-200 bg-white p-10 shadow-2xl dark:border-red-900 dark:bg-zinc-950`}
			>
				<div class="mb-8 flex flex-col items-center text-center">
					<div
						class="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-200 bg-red-100 text-red-600 dark:border-red-800 dark:bg-red-900/30"
					>
						<Icon name="alert-triangle" size={40} />
					</div>
					<h3 class="text-2xl font-black tracking-tighter text-red-600 uppercase italic">
						Konfirmasi Final
					</h3>
					<p class="mt-2 text-sm font-medium text-zinc-500">
						Buktikan bahwa Anda serius menghapus masa depan digital Anda di platform ini.
					</p>
				</div>

				<p class="mb-6 text-center text-xs text-zinc-600 italic dark:text-zinc-400">
					Ketik kata kunci <span class="border-b-2 border-red-600 font-black text-red-600 uppercase"
						>HAPUS</span
					> di bawah ini untuk mengonfirmasi.
				</p>

				<form
					method="POST"
					action="?/deleteAccount"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'failure') {
								const errorMsg = (result.data as any)?.error || 'Gagal menghapus akun';
								toast.error(errorMsg);
							}
							// Success redirects, no toast needed
						};
					}}
					class="space-y-6"
				>
					<input
						type="text"
						name="confirmText"
						bind:value={deleteConfirmText}
						placeholder="MASUKKAN KATAKUNCI"
						class={`w-full border-2 p-4 ${deleteConfirmText === 'HAPUS' ? 'border-red-500 bg-red-50/50' : 'border-zinc-200'} rounded-2xl text-center font-black tracking-[0.2em] transition-all outline-none dark:border-zinc-800 dark:bg-zinc-900`}
						required
					/>

					<div class="flex gap-4">
						<button
							type="button"
							onclick={() => {
								showDeleteModal = false;
								deleteConfirmText = '';
							}}
							class="flex-1 rounded-2xl border-2 border-zinc-200 p-4 text-xs font-black tracking-widest uppercase transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
							>Batal</button
						>
						<button
							type="submit"
							disabled={deleteConfirmText !== 'HAPUS'}
							class="flex-1 rounded-2xl bg-red-600 p-4 text-xs font-black tracking-widest text-white uppercase shadow-xl transition-all hover:bg-red-700 active:scale-95 disabled:opacity-30 disabled:grayscale"
						>
							Hapus Permanen
						</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</PageWrapper>

<style>
	:global(.animate-in) {
		animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}
	@keyframes slide-up {
		from {
			opacity: 0;
			transform: translateY(30px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
</style>
