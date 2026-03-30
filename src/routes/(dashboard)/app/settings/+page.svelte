<script lang="ts">
	import { enhance } from '$app/forms';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import { COLOR, TEXT, RADIUS, TRANSITION, SPACING } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';
	import AuthFormField from '$lib/components/AuthFormField.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import { toast } from '$lib/stores/toast';

	let { data, form } = $props();

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
	let emailNotif = $state((data as any).preferences?.emailNotif ?? true);
	let waNotif = $state((data as any).preferences?.waNotif ?? false);
	let focusMode = $state((data as any).preferences?.focusMode ?? true);

	$effect(() => {
		if (form?.success && form?.data?.key) {
			generatedKey = form.data.key;
			showApiKeyModal = true;
		}
	});

	function toggleEmail() {
		emailNotif = !emailNotif;
		(document.getElementById('emailNotifForm') as HTMLFormElement)?.requestSubmit();
	}

	function toggleWA() {
		waNotif = !waNotif;
		(document.getElementById('waNotifForm') as HTMLFormElement)?.requestSubmit();
	}

	function toggleFocus() {
		focusMode = !focusMode;
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
							class={`p-8 ${RADIUS.card} ${COLOR.card} border-2 ${COLOR.cardBorder} flex flex-col items-center text-center shadow-2xl transition-all hover:scale-[1.02]`}
						>
							<div class="relative mb-6">
								<div
									class="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-blue-500/20 bg-blue-100 p-1 dark:bg-zinc-800"
								>
									<Icon name="user" size={80} class="text-blue-600 opacity-40 dark:text-blue-400" />
								</div>
								{#if data.user.isVerified}
									<div
										class="absolute -right-1 -bottom-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-xl dark:border-zinc-900"
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
							use:enhance
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

			<!-- Security Tab -->
			{#if activeTab === 'security'}
				<div class="animate-in mx-auto max-w-2xl">
					<form
						method="POST"
						action="?/changePassword"
						use:enhance
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
									use:enhance
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
									class="rounded-2xl border border-orange-200 bg-orange-50 p-6 dark:border-orange-900 dark:bg-orange-950/20"
								>
									<Icon name="alert-triangle" class="mx-auto mb-2 text-orange-600" />
									<p
										class="text-sm font-bold tracking-widest text-orange-800 uppercase italic dark:text-orange-300"
									>
										Verifikasi Diperlukan
									</p>
									<p class="mt-2 text-xs text-orange-700">
										Silakan hubungi administrator untuk melakukan verifikasi KTP sebelum Anda dapat
										membuat organisasi.
									</p>
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
								<form method="POST" action="?/updateOrgSettings" use:enhance class="space-y-6">
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
							if (result.type === 'failure') {
								emailNotif = !emailNotif;
								toast.error('Gagal menyimpan preferensi');
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
							if (result.type === 'failure') {
								waNotif = !waNotif;
								toast.error('Gagal menyimpan preferensi');
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
										class={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${emailNotif ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'}`}
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
										class={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${waNotif ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'}`}
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
										class={`relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors ${focusMode ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-700'}`}
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
					<form method="POST" action="?/createApiKey" use:enhance class="space-y-6">
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

				<form method="POST" action="?/deleteAccount" use:enhance class="space-y-6">
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
