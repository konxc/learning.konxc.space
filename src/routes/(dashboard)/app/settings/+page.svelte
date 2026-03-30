<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import AuthFormField from '$lib/components/AuthFormField.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import { enhance } from '$app/forms';
	import { COLOR, RADIUS, TRANSITION, TEXT } from '$lib/config/design';
	import { toast } from '$lib/stores/toast';
	import { initTheme, setTheme, getStoredTheme, type Theme } from '$lib/stores/theme';
	import { setLocale, getLocale } from '$lib/paraglide/runtime.js';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const availableTabs = $derived(data.headerTabs.tabs.map((t) => t.id));
	type TabType = string;

	let activeTab = $state<TabType>(data.headerTabs.activeTab);

	let fullName = $state(data.user?.fullName || '');
	let email = $state(data.user?.email || '');
	let phone = $state(data.user?.phone || '');
	let username = $state(data.user?.username || '');

	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	let showPasswordChange = $state(false);

	// Preferences state
	let theme = $state<Theme>('system');
	let currentLocale = $state('id');

	// Payment Gateway state
	let midtransEnvironment = $state<'sandbox' | 'production'>('sandbox');
	let merchantId = $state('');
	let clientKey = $state('');
	let serverKey = $state('');
	let isProcessing = $state(false);

	onMount(() => {
		initTheme();
		theme = getStoredTheme();
		try {
			currentLocale = getLocale();
		} catch {
			currentLocale = 'id';
		}
	});

	$effect(() => {
		if (data.headerTabs.activeTab !== activeTab) {
			activeTab = data.headerTabs.activeTab;
		}
	});

	// Show form errors/success as toasts
	$effect(() => {
		if (form?.error) {
			toast.error(form.error);
		}
		if (form?.success) {
			toast.success(form.message || 'Perubahan berhasil disimpan.');
		}
	});

	function handleThemeChange(newTheme: Theme) {
		theme = newTheme;
		setTheme(newTheme);
		toast.success('Tema berhasil diubah!');
	}

	function handleLocaleChange(locale: string) {
		if (locale === 'id' || locale === 'en' || locale === 'jp') {
			setLocale(locale);
			currentLocale = locale;
			toast.success('Bahasa berhasil diubah!');
		}
	}
</script>

<svelte:head>
	<title>Pengaturan - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Pengaturan Akun"
		description="Kelola identitas, keamanan, dan preferensi platform kamu di satu tempat."
	/>

	<div class="w-full">
		<main class="w-full">
			<!-- Profile Tab -->
			{#if activeTab === 'profile'}
				<div
					class="animate-in fade-in slide-in-from-bottom-5 grid grid-cols-1 gap-6 duration-700 lg:grid-cols-12"
				>
					<div
						class={`lg:col-span-8 ${RADIUS.card} border ${COLOR.cardBorder} overflow-hidden bg-white shadow-sm dark:bg-zinc-900`}
					>
						<div
							class="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800"
						>
							<h2 class={`${TEXT.h3} ${COLOR.textPrimary} font-black`}>Identitas Inti</h2>
							<span
								class="rounded-md bg-blue-50 px-2 py-1 text-xs font-bold tracking-widest text-blue-600 uppercase dark:bg-blue-900/20"
								>Wajib</span
							>
						</div>

						<form
							method="POST"
							action="?/updateProfile"
							use:enhance={() => {
								isProcessing = true;
								return async ({ result, update }) => {
									if (result.type === 'success') {
										toast.success('Profil berhasil diperbarui!');
										await update();
									} else if (result.type === 'failure') {
										const msg = String(result.data?.error || 'Gagal memperbarui profil');
										toast.error(msg);
									}
									isProcessing = false;
								};
							}}
							class="space-y-6 p-6"
						>
							<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
								<AuthFormField
									label="Username"
									name="username"
									bind:value={username}
									placeholder="Username"
									required={true}
									hint="Username tidak dapat diubah."
									autocomplete="username"
								/>

								<AuthFormField
									label="Nama Lengkap"
									name="fullName"
									bind:value={fullName}
									placeholder="Nama Lengkap"
									required={true}
									autocomplete="name"
								/>

								<AuthFormField
									label="Email Utama"
									type="email"
									name="email"
									bind:value={email}
									placeholder="email@example.com"
									required={true}
									autocomplete="email"
								/>

								<AuthFormField
									label="Nomor Telepon"
									type="tel"
									name="phone"
									bind:value={phone}
									placeholder="+62 8xx-xxxx-xxxx"
									autocomplete="tel"
								/>
							</div>

							<div class="flex justify-end border-t border-zinc-100 pt-4 dark:border-zinc-800">
								<div class="w-full sm:w-auto">
									<AuthSubmitButton
										text="Simpan Identitas"
										loading={isProcessing}
										disabled={isProcessing}
									/>
								</div>
							</div>
						</form>
					</div>

					<div class="space-y-6 lg:col-span-4">
						<div
							class={`${RADIUS.card} border ${COLOR.cardBorder} group relative overflow-hidden p-6 text-white shadow-lg transition-all duration-500
							${
								data.user?.role === 'admin'
									? 'bg-linear-to-br from-slate-900 via-purple-900 to-slate-900'
									: data.user?.role === 'mentor'
										? 'bg-linear-to-br from-indigo-600 via-blue-700 to-indigo-800'
										: data.user?.role === 'facilitator'
											? 'bg-linear-to-br from-amber-600 via-orange-700 to-amber-800'
											: 'bg-linear-to-br from-blue-600 to-indigo-700'
							}`}
						>
							<div class="relative z-10 flex h-full flex-col justify-between gap-8">
								<div class="space-y-1">
									<div class="flex items-center gap-2">
										<div class="h-1.5 w-1.5 animate-pulse rounded-full bg-white"></div>
										<p class="text-[10px] font-black tracking-[0.2em] uppercase opacity-70">
											Status Otoritas
										</p>
									</div>
									<h3 class="text-2xl font-black tracking-tighter uppercase italic">
										{data.user?.role === 'admin'
											? 'Platform Admin'
											: data.user?.role === 'mentor'
												? 'Expert Mentor'
												: data.user?.role === 'facilitator'
													? 'Learning Facilitator'
													: 'Premium Student'}
									</h3>
								</div>
								<div class="space-y-1">
									<p class="text-xs opacity-80">Terdaftar Sejak</p>
									<p class="font-bold">
										{data.user?.createdAt
											? new Date(data.user.createdAt).toLocaleDateString('id-ID', {
													month: 'long',
													year: 'numeric'
												})
											: '-'}
									</p>
								</div>
							</div>
							<!-- Decorative Blobs -->
							<div
								class="absolute top-[-20%] right-[-20%] h-32 w-32 rounded-full bg-white/20 blur-2xl transition-transform duration-1000 group-hover:scale-150"
							></div>
							<div
								class="absolute bottom-[-20%] left-[-20%] h-24 w-24 animate-pulse rounded-full bg-blue-400/30 blur-xl"
							></div>
						</div>

						<div
							class={`${RADIUS.card} border ${COLOR.cardBorder} space-y-4 bg-white p-6 dark:bg-zinc-900`}
						>
							<h4 class="text-xs font-black tracking-widest text-zinc-400 uppercase">
								Aktivitas Terakhir
							</h4>
							<div class="space-y-4">
								<div class="flex items-center gap-3">
									<div
										class={`h-2 w-2 rounded-full ${data.user?.role === 'admin' ? 'bg-purple-500' : 'bg-green-500'}`}
									></div>
									<p class="text-xs font-semibold">Berhasil login hari ini</p>
								</div>
								<div class="flex items-center gap-3">
									<div class="h-2 w-2 rounded-full bg-blue-500"></div>
									<p class="text-xs font-semibold">Update profil terdeteksi</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Security Tab -->
			{#if activeTab === 'security'}
				<div class="animate-in fade-in slide-in-from-bottom-5 w-full duration-700">
					<div
						class={`overflow-hidden ${RADIUS.card} border ${COLOR.cardBorder} bg-white shadow-sm dark:bg-zinc-900`}
					>
						<div
							class="flex items-center gap-3 border-b border-zinc-100 px-6 py-4 dark:border-zinc-800"
						>
							<span class="text-xl">🛡️</span>
							<h2 class={`${TEXT.h3} ${COLOR.textPrimary} font-black`}>Keamanan Akun</h2>
						</div>

						<div class="p-6">
							<form
								method="POST"
								action="?/changePassword"
								use:enhance={() => {
									isProcessing = true;
									return async ({ result, update }) => {
										if (result.type === 'success') {
											toast.success('Password berhasil diubah!');
											currentPassword = '';
											newPassword = '';
											confirmPassword = '';
											showPasswordChange = false;
											await update();
										} else if (result.type === 'failure') {
											toast.error(String(result.data?.error) || 'Gagal mengubah password');
										}
										isProcessing = false;
									};
								}}
								class="space-y-6"
							>
								{#if !showPasswordChange}
									<div
										class="flex flex-col items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:flex-row dark:border-zinc-700 dark:bg-zinc-800/50"
									>
										<div class="flex items-center gap-4">
											<div
												class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
											>
												<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														stroke-width="2"
														d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
													/>
												</svg>
											</div>
											<div>
												<p class={`${TEXT.body} font-bold ${COLOR.textPrimary}`}>Kata Sandi</p>
												<p class={`${TEXT.small} ${COLOR.textSecondary}`}>
													Rutin ubah password untuk menjaga keamanan.
												</p>
											</div>
										</div>
										<button
											type="button"
											onclick={() => (showPasswordChange = true)}
											class={`px-4 py-2 ${RADIUS.button} border ${COLOR.cardBorder} bg-white dark:bg-zinc-800 ${TEXT.button} font-bold shadow-sm ${TRANSITION.all} hover:bg-zinc-50 active:scale-95 dark:hover:bg-zinc-700`}
										>
											Ubah Password
										</button>
									</div>
								{:else}
									<div class="animate-in fade-in space-y-5 duration-300">
										<AuthFormField
											label="Password Saat Ini"
											type="password"
											name="currentPassword"
											bind:value={currentPassword}
											placeholder="••••••••"
											required={true}
										/>

										<div class="space-y-2">
											<AuthFormField
												label="Password Baru"
												type="password"
												name="newPassword"
												bind:value={newPassword}
												placeholder="••••••••"
												required={true}
												minlength={8}
											/>
											<p class={`${TEXT.small} ${COLOR.textMuted}`}>
												Minimum 8 karakter kombinasi.
											</p>
										</div>

										<AuthFormField
											label="Konfirmasi Password Baru"
											type="password"
											name="confirmPassword"
											bind:value={confirmPassword}
											placeholder="••••••••"
											required={true}
										/>

										{#if confirmPassword && newPassword !== confirmPassword}
											<p class="animate-bounce px-1 text-xs font-bold text-red-500 italic">
												⚠️ Password tidak cocok!
											</p>
										{/if}

										<div
											class="flex items-center gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800"
										>
											<button
												type="button"
												onclick={() => (showPasswordChange = false)}
												class={`flex-1 px-4 py-3 ${RADIUS.button} border ${COLOR.cardBorder} bg-white dark:bg-zinc-800 ${TEXT.button} font-bold ${TRANSITION.all} hover:bg-zinc-50 dark:hover:bg-zinc-700`}
											>
												Batal
											</button>
											<div class="flex-1">
												<AuthSubmitButton
													text="Update Password"
													loading={isProcessing}
													disabled={isProcessing ||
														!currentPassword ||
														!newPassword ||
														newPassword !== confirmPassword ||
														newPassword.length < 8}
												/>
											</div>
										</div>
									</div>
								{/if}
							</form>
						</div>
					</div>

					<div
						class="mt-6 flex gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 dark:border-blue-900/30 dark:bg-blue-950/10"
					>
						<span class="mt-1 text-2xl">🛡️</span>
						<div>
							<p class={`${TEXT.body} font-bold text-blue-800 dark:text-blue-300`}>
								Keamanan Terenkripsi
							</p>
							<p class={`${TEXT.small} leading-relaxed text-blue-700/70 dark:text-blue-400/60`}>
								Seluruh data pribadi kamu dienkripsi menggunakan standar industri. Kami tidak pernah
								membagikan password kamu kepada siapapun.
							</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Preferences Tab -->
			{#if activeTab === 'preferences'}
				<div
					class="animate-in fade-in slide-in-from-bottom-5 grid grid-cols-1 gap-6 duration-700 md:grid-cols-2"
				>
					<div
						class={`${RADIUS.card} border ${COLOR.cardBorder} overflow-hidden bg-white shadow-sm dark:bg-zinc-900`}
					>
						<div class="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
							<h3 class={`${TEXT.body} font-black ${COLOR.textPrimary} tracking-widest uppercase`}>
								Tema Visual
							</h3>
						</div>
						<div class="space-y-4 p-6">
							<p class={`${TEXT.small} ${COLOR.textSecondary}`}>
								Pilih suasana yang paling nyaman untuk matamu selama belajar.
							</p>
							<div class="flex flex-col gap-2">
								{#each [{ id: 'light', label: 'Terang', icon: '☀️' }, { id: 'dark', label: 'Gelap', icon: '🌙' }, { id: 'system', label: 'Sistem', icon: '💻' }] as t}
									<button
										type="button"
										onclick={() => handleThemeChange(t.id as Theme)}
										class={`flex items-center justify-between px-4 py-3 ${RADIUS.button} border ${TRANSITION.all}
							${
								theme === t.id
									? 'border-blue-600 bg-blue-50 font-bold text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
									: `border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 ${COLOR.textPrimary}`
							}`}
									>
										<div class="flex items-center gap-3">
											<span>{t.icon}</span>
											{t.label}
										</div>
										{#if theme === t.id}
											<div class="h-2 w-2 rounded-full bg-blue-600"></div>
										{/if}
									</button>
								{/each}
							</div>
						</div>
					</div>

					<div
						class={`${RADIUS.card} border ${COLOR.cardBorder} overflow-hidden bg-white shadow-sm dark:bg-zinc-900`}
					>
						<div class="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
							<h3 class={`${TEXT.body} font-black ${COLOR.textPrimary} tracking-widest uppercase`}>
								Bahasa Antarmuka
							</h3>
						</div>
						<div class="space-y-4 p-6">
							<p class={`${TEXT.small} ${COLOR.textSecondary}`}>
								Gunakan bahasa yang paling kamu kuasai untuk efisiensi belajar.
							</p>
							<div class="flex flex-col gap-2">
								{#each [{ id: 'id', label: 'Indonesia', flag: '🇮🇩' }, { id: 'en', label: 'English', flag: '🇬🇧' }, { id: 'jp', label: '日本語', flag: '🇯🇵' }] as l}
									<button
										type="button"
										onclick={() => handleLocaleChange(l.id)}
										class={`flex items-center justify-between px-4 py-3 ${RADIUS.button} border ${TRANSITION.all}
							${
								currentLocale === l.id
									? 'border-blue-600 bg-blue-50 font-bold text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
									: `border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800 ${COLOR.textPrimary}`
							}`}
									>
										<div class="flex items-center gap-3">
											<span>{l.flag}</span>
											{l.label}
										</div>
										{#if currentLocale === l.id}
											<div class="h-2 w-2 rounded-full bg-blue-600"></div>
										{/if}
									</button>
								{/each}
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Payment Gateway Tab -->
			{#if activeTab === 'payments'}
				<div class="animate-in fade-in slide-in-from-bottom-5 space-y-8 duration-700">
					<div
						class={`p-8 ${RADIUS.card} relative overflow-hidden bg-linear-to-r from-zinc-900 to-zinc-800 text-white shadow-xl`}
					>
						<div
							class="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center"
						>
							<div class="space-y-2">
								<div class="flex items-center gap-2">
									<div class="h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
									<span class="text-[10px] font-black tracking-widest uppercase opacity-70"
										>Payment Gateway</span
									>
								</div>
								<h2 class="text-3xl font-black tracking-tight">Midtrans Configuration</h2>
								<p class="max-w-md text-xs opacity-60">
									Sambungkan akun Midtrans kamu untuk mulai menerima pembayaran otomatis dari ribuan
									peserta didik.
								</p>
							</div>
							<div class="flex items-center gap-4">
								<button
									onclick={() => (midtransEnvironment = 'sandbox')}
									class={`px-4 py-2 ${RADIUS.button} border border-white/20 text-[10px] font-black tracking-widest uppercase ${midtransEnvironment === 'sandbox' ? 'bg-white text-zinc-900' : 'hover:bg-white/10'}`}
								>
									🧪 Sandbox
								</button>
								<button
									onclick={() => (midtransEnvironment = 'production')}
									class={`px-4 py-2 ${RADIUS.button} border border-white/20 text-[10px] font-black tracking-widest uppercase ${midtransEnvironment === 'production' ? 'border-green-400 bg-green-500 text-white' : 'hover:bg-white/10'}`}
								>
									🚀 Production
								</button>
							</div>
						</div>
						<div
							class="absolute top-0 right-0 h-64 w-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl"
						></div>
					</div>

					<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
						<div
							class={`${RADIUS.card} border ${COLOR.cardBorder} overflow-hidden bg-white shadow-sm dark:bg-zinc-900`}
						>
							<div class="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
								<h3
									class={`${TEXT.body} font-black ${COLOR.textPrimary} tracking-widest uppercase`}
								>
									Kredensial Gateway
								</h3>
							</div>
							<div class="space-y-6 p-6">
								<AuthFormField
									name="merchantId"
									label="Merchant ID"
									bind:value={merchantId}
									placeholder="G12345678"
									hint="Cek di Dashboard Midtrans -> Settings -> Configuration"
								/>
								<AuthFormField
									name="clientKey"
									label="Client Key"
									bind:value={clientKey}
									placeholder="VT-client-xxxx"
								/>
								<AuthFormField
									name="serverKey"
									label="Server Key"
									type="password"
									bind:value={serverKey}
									placeholder="••••••••••••"
									required={true}
								/>
							</div>
						</div>

						<div class="space-y-6">
							<div
								class={`${RADIUS.card} border ${COLOR.cardBorder} space-y-4 bg-zinc-50 p-6 dark:bg-zinc-800/50`}
							>
								<div class="flex items-center gap-2">
									<span class="text-xl">📡</span>
									<h3 class="text-xs font-black tracking-widest text-zinc-400 uppercase">
										Webhook Endpoint
									</h3>
								</div>
								<div class="space-y-3">
									<p class="text-[10px] leading-relaxed font-bold text-zinc-500">
										Konfigurasi URL di bawah ini pada bagian <b>Notification URL</b> di dashboard Midtrans
										untuk sinkronisasi status transaksi.
									</p>
									<div class="flex gap-2">
										<input
											readonly
											value="https://naikkelas.id/api/payments/webhook"
											class={`flex-1 ${RADIUS.input} border ${COLOR.cardBorder} truncate bg-white px-3 py-2 font-mono text-xs dark:bg-zinc-900`}
										/>
										<button
											onclick={() => {
												navigator.clipboard.writeText('https://naikkelas.id/api/payments/webhook');
												toast.success('Webhook URL copied!');
											}}
											class={`px-3 py-2 ${RADIUS.button} border ${COLOR.cardBorder} bg-white text-[10px] font-bold transition-colors hover:bg-zinc-50 dark:bg-zinc-800 dark:hover:bg-zinc-700`}
										>
											COPY
										</button>
									</div>
								</div>
							</div>

							<div class="grid grid-cols-2 gap-4">
								<button
									onclick={() => toast.info('Testing connection...')}
									class={`h-14 ${RADIUS.button} border ${COLOR.cardBorder} bg-white dark:bg-zinc-900 ${TEXT.button} font-black tracking-widest uppercase shadow-sm transition-all hover:bg-zinc-50 active:scale-95 dark:hover:bg-zinc-700`}
								>
									🔗 Test Connection
								</button>
								<AuthSubmitButton
									text="Simpan Config"
									loading={isProcessing}
									disabled={!merchantId || !clientKey || !serverKey}
								/>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</main>
	</div>
</PageWrapper>
