<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import AuthFormField from '$lib/components/AuthFormField.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import AuthMessage from '$lib/components/AuthMessage.svelte';
	import { enhance } from '$app/forms';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION, GRADIENT } from '$lib/config/design';
	import { toast } from '$lib/stores/toast';
	import { initTheme, setTheme, getStoredTheme, type Theme } from '$lib/stores/theme';
	import { setLocale, getLocale } from '$lib/paraglide/runtime.js';
	import { brandMode, toggleBrandMode } from '$lib/stores/brandMode';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const validTabs = ['profile', 'security', 'preferences', 'payments'] as const;
	type TabType = (typeof validTabs)[number];

	let activeTab = $state<TabType>('profile');

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
	let brandModeValue = $state<'chill' | 'hardcore'>('chill');

	// Payment Gateway state (placeholder/partial implementation)
	let midtransEnvironment = $state<'sandbox' | 'production'>('sandbox');
	let merchantId = $state('');
	let clientKey = $state('');
	let serverKey = $state('');
	let isProcessing = $state(false);

	onMount(() => {
		const param = $page.url.searchParams.get('tab');
		if (param && validTabs.includes(param as TabType)) {
			activeTab = param as TabType;
		} else {
			activeTab = 'profile';
		}

		initTheme();
		theme = getStoredTheme();
		try {
			currentLocale = getLocale();
		} catch {
			currentLocale = 'id';
		}
		brandModeValue = $brandMode;
	});

	$effect(() => {
		const param = $page.url.searchParams.get('tab');
		if (param && validTabs.includes(param as TabType)) {
			activeTab = param as TabType;
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

	function handleBrandModeChange() {
		toggleBrandMode();
		brandModeValue = $brandMode;
		toast.success('Mode kampanye berhasil diubah!');
	}

	const tabs = [
		{ id: 'profile', label: 'Profil', icon: '👤' },
		{ id: 'security', label: 'Keamanan', icon: '🔒' },
		{ id: 'payments', label: 'Pembayaran', icon: '💳' },
		{ id: 'preferences', label: 'Preferensi', icon: '⚙️' }
	] as const;
</script>

<svelte:head>
	<title>Pengaturan - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader 
		title="Pengaturan Akun" 
		description="Kelola identitas, keamanan, dan preferensi platform kamu di satu tempat."
	/>

	<div class="flex flex-col lg:flex-row gap-8 items-start">
		<!-- Modern Sidebar Nav -->
		<aside class={`w-full lg:w-64 sticky top-24 z-10 space-y-2 p-1 ${RADIUS.card} border ${COLOR.cardBorder} bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md`}>
			{#each tabs as tab}
				<button
					onclick={() => activeTab = tab.id}
					class={`w-full flex items-center gap-3 px-4 py-3 ${RADIUS.button} ${TEXT.button} font-bold ${TRANSITION.all}
					${activeTab === tab.id 
						? `${COLOR.accentBg} text-white shadow-lg` 
						: `${COLOR.textSecondary} hover:bg-zinc-100 dark:hover:bg-zinc-800`}`}
				>
					<span class="text-lg">{tab.icon}</span>
					{tab.label}
				</button>
			{/each}
		</aside>

		<!-- Content Area -->
		<main class="flex-1 w-full space-y-6">
			{#if form?.error}
				<AuthMessage type="error" message={form.error} />
			{/if}

			{#if form?.success}
				<AuthMessage type="success" message={form.message || 'Perubahan berhasil disimpan.'} />
			{/if}

			<!-- Profile Tab -->
			{#if activeTab === 'profile'}
				<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
					<!-- Essential Identity Card -->
					<div class={`lg:col-span-8 ${RADIUS.card} border ${COLOR.cardBorder} bg-white dark:bg-zinc-900 shadow-sm overflow-hidden`}>
						<div class="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
							<h2 class={`${TEXT.h3} ${COLOR.textPrimary} font-black`}>Identitas Inti</h2>
							<span class="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md uppercase tracking-widest">Wajib</span>
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
							class="p-6 space-y-6"
						>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

							<div class="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
								<div class="w-full sm:w-auto">
									<AuthSubmitButton text="Simpan Identitas" loading={isProcessing} disabled={isProcessing} />
								</div>
							</div>
						</form>
					</div>

					<!-- Sidebar Info / Stats Card -->
					<div class="lg:col-span-4 space-y-6">
						<div class={`${RADIUS.card} border ${COLOR.cardBorder} bg-linear-to-br from-blue-600 to-indigo-700 p-6 text-white overflow-hidden relative group`}>
							<div class="relative z-10 flex flex-col h-full justify-between gap-8">
								<div>
									<p class="text-[10px] font-black tracking-[0.2em] uppercase opacity-70 mb-1">Status Keanggotaan</p>
									<h3 class="text-2xl font-black italic tracking-tighter uppercase">Premium Squad</h3>
								</div>
								<div class="space-y-1">
									<p class="text-xs opacity-80">Terdaftar Sejak</p>
									<p class="font-bold">
										{data.user?.createdAt ? new Date(data.user.createdAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : '-'}
									</p>
								</div>
							</div>
							<!-- Decorative Blobs -->
							<div class="absolute top-[-20%] right-[-20%] w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
							<div class="absolute bottom-[-20%] left-[-20%] w-24 h-24 bg-blue-400/30 rounded-full blur-xl animate-pulse"></div>
						</div>

						<div class={`${RADIUS.card} border ${COLOR.cardBorder} bg-white dark:bg-zinc-900 p-6 space-y-4`}>
							<h4 class="text-xs font-black tracking-widest text-zinc-400 uppercase">Aktivitas Terakhir</h4>
							<div class="space-y-4">
								<div class="flex items-center gap-3">
									<div class="h-2 w-2 rounded-full bg-green-500"></div>
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
				<div class="max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">
					<div class={`overflow-hidden ${RADIUS.card} border ${COLOR.cardBorder} bg-white dark:bg-zinc-900 shadow-sm`}>
						<div class="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
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
									<div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
										<div class="flex items-center gap-4">
											<div class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
												<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
												</svg>
											</div>
											<div>
												<p class={`${TEXT.body} font-bold ${COLOR.textPrimary}`}>Kata Sandi</p>
												<p class={`${TEXT.small} ${COLOR.textSecondary}`}>Rutin ubah password untuk menjaga keamanan.</p>
											</div>
										</div>
										<button
											type="button"
											onclick={() => (showPasswordChange = true)}
											class={`px-4 py-2 ${RADIUS.button} border ${COLOR.cardBorder} bg-white dark:bg-zinc-800 ${TEXT.button} font-bold shadow-sm ${TRANSITION.all} hover:bg-zinc-50 dark:hover:bg-zinc-700 active:scale-95`}
										>
											Ubah Password
										</button>
									</div>
								{:else}
									<div class="space-y-5 animate-in fade-in duration-300">
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
											<p class={`${TEXT.small} ${COLOR.textMuted}`}>Minimum 8 karakter kombinasi.</p>
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
											<p class="text-xs font-bold text-red-500 px-1 italic animate-bounce">
												⚠️ Password tidak cocok!
											</p>
										{/if}

										<div class="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
											<button
												type="button"
												onclick={() => (showPasswordChange = false)}
												class={`flex-1 px-4 py-3 ${RADIUS.button} border ${COLOR.cardBorder} bg-white dark:bg-zinc-800 ${TEXT.button} font-bold ${TRANSITION.all} hover:bg-zinc-50 dark:hover:bg-zinc-700`}
											>
												Batal
											</button>
											<div class="flex-[2]">
												<AuthSubmitButton 
													text="Update Password" 
													loading={isProcessing} 
													disabled={isProcessing || !currentPassword || !newPassword || newPassword !== confirmPassword || newPassword.length < 8} 
												/>
											</div>
										</div>
									</div>
								{/if}
							</form>
						</div>
					</div>

					<!-- Trust Shield Info -->
					<div class="mt-6 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 flex gap-4">
						<span class="text-2xl mt-1">🛡️</span>
						<div>
							<p class={`${TEXT.body} font-bold text-blue-800 dark:text-blue-300`}>Keamanan Terenkripsi</p>
							<p class={`${TEXT.small} text-blue-700/70 dark:text-blue-400/60 leading-relaxed`}>
								Seluruh data pribadi kamu dienkripsi menggunakan standar industri. Kami tidak pernah membagikan password kamu kepada siapapun.
							</p>
						</div>
					</div>
				</div>
			{/if}

	<!-- Preferences Tab -->
	{#if activeTab === 'preferences'}
		<PageSection>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-6`}>Preferensi</h2>
			<div class="space-y-6">
			<!-- Preferences Tab -->
			{#if activeTab === 'preferences'}
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
					<!-- Theme Selection -->
					<div class={`${RADIUS.card} border ${COLOR.cardBorder} bg-white dark:bg-zinc-900 overflow-hidden shadow-sm`}>
						<div class="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
							<h3 class={`${TEXT.body} font-black ${COLOR.textPrimary} uppercase tracking-widest`}>Tema Visual</h3>
						</div>
						<div class="p-6 space-y-4">
							<p class={`${TEXT.small} ${COLOR.textSecondary}`}>Pilih suasana yang paling nyaman untuk matamu selama belajar.</p>
							<div class="flex flex-col gap-2">
								{#each [{id: 'light', label: 'Terang', icon: '☀️'}, {id: 'dark', label: 'Gelap', icon: '🌙'}, {id: 'system', label: 'Sistem', icon: '💻'}] as t}
									<button
										type="button"
										onclick={() => handleThemeChange(t.id as Theme)}
										class={`flex items-center justify-between px-4 py-3 ${RADIUS.button} border ${TRANSITION.all}
										${theme === t.id 
											? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold' 
											: `border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 ${COLOR.textPrimary}`}`}
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

					<!-- Language Selection -->
					<div class={`${RADIUS.card} border ${COLOR.cardBorder} bg-white dark:bg-zinc-900 overflow-hidden shadow-sm`}>
						<div class="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
							<h3 class={`${TEXT.body} font-black ${COLOR.textPrimary} uppercase tracking-widest`}>Bahasa Antarmuka</h3>
						</div>
						<div class="p-6 space-y-4">
							<p class={`${TEXT.small} ${COLOR.textSecondary}`}>Gunakan bahasa yang paling kamu kuasai untuk efisiensi belajar.</p>
							<div class="flex flex-col gap-2">
								{#each [{id: 'id', label: 'Indonesia', flag: '🇮🇩'}, {id: 'en', label: 'English', flag: '🇬🇧'}, {id: 'jp', label: '日本語', flag: '🇯🇵'}] as l}
									<button
										type="button"
										onclick={() => handleLocaleChange(l.id)}
										class={`flex items-center justify-between px-4 py-3 ${RADIUS.button} border ${TRANSITION.all}
										${currentLocale === l.id 
											? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-bold' 
											: `border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 ${COLOR.textPrimary}`}`}
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

					<!-- Brand Mode Card -->
					<div class={`md:col-span-2 ${RADIUS.card} border ${COLOR.cardBorder} bg-white dark:bg-zinc-900 p-6 shadow-sm`}>
						<div class="flex flex-col sm:flex-row items-center justify-between gap-6">
							<div class="space-y-1 text-center sm:text-left">
								<h3 class={`${TEXT.body} font-black ${COLOR.textPrimary} uppercase tracking-widest`}>Mode Kampanye</h3>
								<p class={`${TEXT.small} ${COLOR.textSecondary}`}>
									{brandModeValue === 'hardcore' 
										? '🔥 Mode Hardcore: Visual penuh energi untuk meningkatkan motivasi.' 
										: '😎 Mode Chill: Tampilan tenang dan minimalis untuk fokus mendalam.'}
								</p>
							</div>
							<button
								type="button"
								onclick={handleBrandModeChange}
								class={`px-8 py-4 ${RADIUS.button} font-black tracking-widest uppercase ${TRANSITION.all} shadow-lg active:scale-95
								${brandModeValue === 'hardcore' 
									? 'bg-linear-to-r from-orange-600 to-red-600 text-white hover:shadow-orange-500/20' 
									: 'bg-linear-to-r from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 text-zinc-900 dark:text-zinc-100'}`}
							>
								{brandModeValue === 'hardcore' ? 'Switch to Chill' : 'Switch to Hardcore'}
							</button>
						</div>
					</div>
				</div>
			{/if}
			</div>
		</PageSection>
	{/if}

			<!-- Payment Gateway Tab -->
			{#if activeTab === 'payments'}
				<div class="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
					<!-- Finance Header -->
					<div class={`p-8 ${RADIUS.card} bg-linear-to-r from-zinc-900 to-zinc-800 text-white overflow-hidden relative shadow-xl`}>
						<div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
							<div class="space-y-2">
								<div class="flex items-center gap-2">
									<div class="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
									<span class="text-[10px] font-black tracking-widest uppercase opacity-70">Payment Gateway</span>
								</div>
								<h2 class="text-3xl font-black tracking-tight">Midtrans Configuration</h2>
								<p class="text-xs opacity-60 max-w-md">Sambungkan akun Midtrans kamu untuk mulai menerima pembayaran otomatis dari ribuan peserta didik.</p>
							</div>
							<div class="flex items-center gap-4">
								<button 
									onclick={() => midtransEnvironment = 'sandbox'}
									class={`px-4 py-2 ${RADIUS.button} text-[10px] font-black uppercase tracking-widest border border-white/20 ${midtransEnvironment === 'sandbox' ? 'bg-white text-zinc-900' : 'hover:bg-white/10'}`}
								>
									🧪 Sandbox
								</button>
								<button 
									onclick={() => midtransEnvironment = 'production'}
									class={`px-4 py-2 ${RADIUS.button} text-[10px] font-black uppercase tracking-widest border border-white/20 ${midtransEnvironment === 'production' ? 'bg-green-500 text-white border-green-400' : 'hover:bg-white/10'}`}
								>
									🚀 Production
								</button>
							</div>
						</div>
						<!-- Decorative -->
						<div class="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
					</div>

					<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<!-- Credentials Card -->
						<div class={`${RADIUS.card} border ${COLOR.cardBorder} bg-white dark:bg-zinc-900 shadow-sm overflow-hidden`}>
							<div class="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
								<h3 class={`${TEXT.body} font-black ${COLOR.textPrimary} uppercase tracking-widest`}>Kredensial Gateway</h3>
							</div>
							<div class="p-6 space-y-6">
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

						<!-- Webhook & Status Card -->
						<div class="space-y-6">
							<div class={`${RADIUS.card} border ${COLOR.cardBorder} bg-zinc-50 dark:bg-zinc-800/50 p-6 space-y-4`}>
								<div class="flex items-center gap-2">
									<span class="text-xl">📡</span>
									<h3 class="text-xs font-black tracking-widest text-zinc-400 uppercase">Webhook Endpoint</h3>
								</div>
								<div class="space-y-3">
									<p class="text-[10px] text-zinc-500 font-bold leading-relaxed">
										Konfigurasi URL di bawah ini pada bagian <b>Notification URL</b> di dashboard Midtrans untuk sinkronisasi status transaksi.
									</p>
									<div class="flex gap-2">
										<input
											readonly
											value="https://naikkelas.id/api/payments/webhook"
											class={`flex-1 ${RADIUS.input} border ${COLOR.cardBorder} bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-mono truncate`}
										/>
										<button 
											onclick={() => {
												navigator.clipboard.writeText("https://naikkelas.id/api/payments/webhook");
												toast.success("Webhook URL copied!");
											}}
											class={`px-3 py-2 ${RADIUS.button} border ${COLOR.cardBorder} bg-white dark:bg-zinc-800 text-[10px] font-bold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors`}
										>
											COPY
										</button>
									</div>
								</div>
							</div>

							<!-- Actions -->
							<div class="grid grid-cols-2 gap-4">
								<button 
									onclick={() => toast.info("Testing connection...")}
									class={`h-14 ${RADIUS.button} border ${COLOR.cardBorder} bg-white dark:bg-zinc-900 ${TEXT.button} font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all active:scale-95 shadow-sm`}
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
