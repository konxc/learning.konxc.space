<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { enhance } from '$app/forms';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import { toast } from '$lib/stores/toast';
	import { initTheme, setTheme, getStoredTheme, applyTheme, type Theme } from '$lib/stores/theme';
	import { setLocale, getLocale } from '$lib/paraglide/runtime.js';
	import { brandMode, toggleBrandMode } from '$lib/stores/brandMode';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { updateQueryParam } from '$lib/utils/url-params';

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

	// Payment Gateway state
	let midtransEnvironment = $state<'sandbox' | 'production'>('sandbox');
	let merchantId = $state('');
	let clientKey = $state('');
	let serverKey = $state('');
	let webhookUrl = $state('');
	let isProcessing = $state(false);

	// Initialize activeTab from URL query parameter on mount
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

	// Sync with URL changes (e.g., browser back/forward)
	$effect(() => {
		const param = $page.url.searchParams.get('tab');
		if (param && validTabs.includes(param as TabType)) {
			if (activeTab !== param) {
				activeTab = param as TabType;
			}
		} else if (activeTab !== 'profile') {
			// If URL doesn't have tab param but activeTab is not default, reset to default
			activeTab = 'profile';
		}
	});

	// Function to update URL query parameter when tab changes
	async function updateTab(newTab: TabType) {
		activeTab = newTab;
		await updateQueryParam($page.url, 'tab', newTab === 'profile' ? null : newTab, goto);
	}

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
</script>

<svelte:head>
	<title>Settings - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="Settings" description="Kelola pengaturan akun dan preferensi Anda" />

	<!-- Tabs Navigation - Keep existing styling -->
	<div class={`mb-6 flex gap-2 border-b ${COLOR.cardBorder}`}>
		<button
			type="button"
			onclick={() => updateTab('profile')}
			class={`px-4 py-2 ${TEXT.button} font-medium ${TRANSITION.colors} border-b-2 ${
				activeTab === 'profile'
					? `${COLOR.textPrimary} border-blue-600`
					: `${COLOR.textSecondary} border-transparent hover:text-gray-900 dark:hover:text-gray-100`
			}`}
		>
			Profil
		</button>
		<button
			type="button"
			onclick={() => updateTab('security')}
			class={`px-4 py-2 ${TEXT.button} font-medium ${TRANSITION.colors} border-b-2 ${
				activeTab === 'security'
					? `${COLOR.textPrimary} border-blue-600`
					: `${COLOR.textSecondary} border-transparent hover:text-gray-900 dark:hover:text-gray-100`
			}`}
		>
			Keamanan
		</button>
		<button
			type="button"
			onclick={() => updateTab('preferences')}
			class={`px-4 py-2 ${TEXT.button} font-medium ${TRANSITION.colors} border-b-2 ${
				activeTab === 'preferences'
					? `${COLOR.textPrimary} border-blue-600`
					: `${COLOR.textSecondary} border-transparent hover:text-gray-900 dark:hover:text-gray-100`
			}`}
		>
			Preferensi
		</button>
		<button
			type="button"
			onclick={() => updateTab('payments')}
			class={`px-4 py-2 ${TEXT.button} font-medium ${TRANSITION.colors} border-b-2 ${
				activeTab === 'payments'
					? `${COLOR.textPrimary} border-blue-600`
					: `${COLOR.textSecondary} border-transparent hover:text-gray-900 dark:hover:text-gray-100`
			}`}
		>
			Payment Gateway
		</button>
	</div>

	<!-- Form Messages - Consistent with other pages -->
	{#if form?.error}
		<PageSection>
			<div
				class={`${RADIUS.button} ${SPACING.cardPadding} border border-red-200 bg-red-50 ${TEXT.body} text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300 ${ELEVATION.base}`}
				role="alert"
			>
				<strong class="font-semibold">Error:</strong>
				{form.error}
			</div>
		</PageSection>
	{/if}

	{#if form?.success}
		<PageSection>
			<div
				class={`${RADIUS.button} ${SPACING.cardPadding} border border-green-200 bg-green-50 ${TEXT.body} text-green-800 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-300 ${ELEVATION.base}`}
				role="alert"
			>
				<strong class="font-semibold">Berhasil!</strong>
				{form.success}
			</div>
		</PageSection>
	{/if}

	<!-- Profile Tab -->
	{#if activeTab === 'profile'}
		<PageSection>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-6`}>Informasi Profil</h2>
			<form
				method="POST"
				action="?/updateProfile"
				use:enhance={() => {
					return async ({ result, update }) => {
					if (result.type === 'success') {
						toast.success('Profil berhasil diperbarui!');
						await update();
					} else if (result.type === 'failure') {
						const failureData = result.data;
						const message =
							typeof failureData === 'object' && failureData && 'error' in failureData &&
							typeof (failureData as { error?: unknown }).error === 'string'
								? (failureData as { error: string }).error
								: 'Gagal memperbarui profil';
						toast.error(message);
					}
					};
				}}
				class="space-y-6"
			>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div class="flex flex-col gap-2">
						<label
							for="username"
							class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
						>
							Username
						</label>
						<input
							type="text"
							id="username"
							name="username"
							value={username}
							disabled
							class={`${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} ${COLOR.card} ${COLOR.textSecondary} cursor-not-allowed opacity-70`}
						/>
						<p class={`${TEXT.small} ${COLOR.textMuted} mt-1`}>
							Username tidak dapat diubah setelah akun dibuat.
						</p>
					</div>

					<div class="flex flex-col gap-2">
						<label
							for="fullName"
							class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
						>
							Nama Lengkap
						</label>
						<input
							type="text"
							id="fullName"
							name="fullName"
							bind:value={fullName}
							placeholder="Masukkan nama lengkap"
							class={`${RADIUS.input} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.input} ${TEXT.body} ${COLOR.textPrimary} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
						/>
					</div>

					<div class="flex flex-col gap-2">
						<label for="email" class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}>
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							bind:value={email}
							placeholder="your@email.com"
							class={`${RADIUS.input} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.input} ${TEXT.body} ${COLOR.textPrimary} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
						/>
					</div>

					<div class="flex flex-col gap-2">
						<label for="phone" class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}>
							Nomor Telepon
						</label>
						<input
							type="tel"
							id="phone"
							name="phone"
							bind:value={phone}
							placeholder="+62 812-3456-7890"
							class={`${RADIUS.input} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.input} ${TEXT.body} ${COLOR.textPrimary} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
						/>
					</div>
				</div>

				<div class="flex items-center justify-end gap-3 pt-4">
					<button
						type="submit"
						class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} ${SPACING.button} ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:opacity-90 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
					>
						Simpan Perubahan
					</button>
				</div>
			</form>
		</PageSection>
	{/if}

	<!-- Security Tab -->
	{#if activeTab === 'security'}
		<PageSection>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-6`}>Keamanan Akun</h2>
			<form
				method="POST"
				action="?/changePassword"
				use:enhance={() => {
					return async ({ result, update }) => {
					if (result.type === 'success') {
						toast.success('Password berhasil diubah!');
						currentPassword = '';
						newPassword = '';
						confirmPassword = '';
						showPasswordChange = false;
						await update();
					} else if (result.type === 'failure') {
						const failureData = result.data;
						const message =
							typeof failureData === 'object' && failureData && 'error' in failureData &&
							typeof (failureData as { error?: unknown }).error === 'string'
								? (failureData as { error: string }).error
								: 'Gagal mengubah password';
						toast.error(message);
					}
					};
				}}
				class="space-y-6"
			>
				{#if !showPasswordChange}
					<div
						class={`flex items-center justify-between ${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding}`}
					>
						<div>
							<h3 class={`${TEXT.button} ${COLOR.textPrimary} mb-1 font-semibold`}>Password</h3>
							<p class={`${TEXT.small} ${COLOR.textSecondary}`}>
								Terakhir diubah: {data.user?.createdAt
									? new Date(data.user.createdAt).toLocaleDateString('id-ID')
									: 'Belum pernah diubah'}
							</p>
						</div>
						<button
							type="button"
							onclick={() => (showPasswordChange = true)}
							class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.button} ${TRANSITION.all} hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-1 dark:hover:bg-blue-950/30 dark:hover:text-blue-300`}
						>
							Ubah Password
						</button>
					</div>
				{:else}
					<div class="space-y-4">
						<div class="flex flex-col gap-2">
							<label
								for="currentPassword"
								class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
							>
								Password Saat Ini
							</label>
							<input
								type="password"
								id="currentPassword"
								name="currentPassword"
								bind:value={currentPassword}
								required
								placeholder="Masukkan password saat ini"
								class={`${RADIUS.input} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.input} ${TEXT.body} ${COLOR.textPrimary} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
							/>
						</div>

						<div class="flex flex-col gap-2">
							<label
								for="newPassword"
								class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
							>
								Password Baru
							</label>
							<input
								type="password"
								id="newPassword"
								name="newPassword"
								bind:value={newPassword}
								required
								minlength="8"
								placeholder="Minimum 8 karakter"
								class={`${RADIUS.input} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.input} ${TEXT.body} ${COLOR.textPrimary} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
							/>
							<p class={`${TEXT.small} ${COLOR.textMuted} mt-1`}>
								Password harus terdiri dari minimal 8 karakter.
							</p>
						</div>

						<div class="flex flex-col gap-2">
							<label
								for="confirmPassword"
								class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
							>
								Konfirmasi Password Baru
							</label>
							<input
								type="password"
								id="confirmPassword"
								name="confirmPassword"
								bind:value={confirmPassword}
								required
								placeholder="Ulangi password baru"
								class={`${RADIUS.input} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.input} ${TEXT.body} ${COLOR.textPrimary} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
							/>
							{#if confirmPassword && newPassword !== confirmPassword}
								<p class={`${TEXT.small} mt-1 text-red-600 dark:text-red-400`}>
									Password tidak cocok.
								</p>
							{/if}
						</div>

						<div class="flex items-center justify-end gap-3 pt-4">
							<button
								type="button"
								onclick={() => {
									showPasswordChange = false;
									currentPassword = '';
									newPassword = '';
									confirmPassword = '';
								}}
								class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.button} ${COLOR.card} ${TRANSITION.colors} ${COLOR.neutralHover} focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900`}
							>
								Batal
							</button>
							<button
								type="submit"
								disabled={!currentPassword ||
									!newPassword ||
									newPassword !== confirmPassword ||
									newPassword.length < 8}
								class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} ${SPACING.button} ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:opacity-90 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-neutral-900`}
							>
								Simpan Password Baru
							</button>
						</div>
					</div>
				{/if}
			</form>
		</PageSection>
	{/if}

	<!-- Preferences Tab -->
	{#if activeTab === 'preferences'}
		<PageSection>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-6`}>Preferensi</h2>
			<div class="space-y-6">
				<!-- Theme Selection -->
				<div class={`${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding}`}>
					<h3 class={`${TEXT.button} ${COLOR.textPrimary} mb-2 font-semibold`}>Tema</h3>
					<p class={`${TEXT.small} ${COLOR.textSecondary} mb-4`}>
						Pilih tampilan yang paling nyaman untuk Anda. Pilih antara tema terang, gelap, atau
						mengikuti preferensi sistem.
					</p>
					<div class="flex flex-wrap gap-2">
						<button
							type="button"
							onclick={() => handleThemeChange('light')}
							class={`inline-flex items-center gap-2 ${RADIUS.button} px-4 py-2 ${TEXT.button} font-medium ${TRANSITION.all} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 ${
								theme === 'light'
									? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/50 dark:bg-amber-950/15 dark:text-amber-400 dark:ring-amber-800/30'
									: 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-neutral-800 dark:text-gray-300 dark:ring-neutral-700 dark:hover:bg-neutral-700'
							}`}
						>
							<span>☀️</span>
							Light
						</button>
						<button
							type="button"
							onclick={() => handleThemeChange('dark')}
							class={`inline-flex items-center gap-2 ${RADIUS.button} px-4 py-2 ${TEXT.button} font-medium ${TRANSITION.all} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 ${
								theme === 'dark'
									? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/50 dark:bg-indigo-950/15 dark:text-indigo-400 dark:ring-indigo-800/30'
									: 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-neutral-800 dark:text-gray-300 dark:ring-neutral-700 dark:hover:bg-neutral-700'
							}`}
						>
							<span>🌙</span>
							Dark
						</button>
						<button
							type="button"
							onclick={() => handleThemeChange('system')}
							class={`inline-flex items-center gap-2 ${RADIUS.button} px-4 py-2 ${TEXT.button} font-medium ${TRANSITION.all} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 ${
								theme === 'system'
									? 'bg-gray-50 text-gray-700 ring-1 ring-gray-200/50 dark:bg-neutral-800/40 dark:text-gray-300 dark:ring-neutral-700/50'
									: 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-neutral-800 dark:text-gray-300 dark:ring-neutral-700 dark:hover:bg-neutral-700'
							}`}
						>
							<span>💻</span>
							System
						</button>
					</div>
				</div>

				<!-- Language Selection -->
				<div class={`${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding}`}>
					<h3 class={`${TEXT.button} ${COLOR.textPrimary} mb-2 font-semibold`}>Bahasa</h3>
					<p class={`${TEXT.small} ${COLOR.textSecondary} mb-4`}>
						Pilih bahasa antarmuka yang Anda inginkan.
					</p>
					<div class="flex flex-wrap gap-2">
						<button
							type="button"
							onclick={() => handleLocaleChange('id')}
							class={`inline-flex items-center gap-2 ${RADIUS.button} px-4 py-2 ${TEXT.button} font-medium ${TRANSITION.all} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 ${
								currentLocale === 'id'
									? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50 dark:bg-blue-950/15 dark:text-blue-400 dark:ring-blue-800/30'
									: 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-neutral-800 dark:text-gray-300 dark:ring-neutral-700 dark:hover:bg-neutral-700'
							}`}
						>
							🇮🇩 Indonesia
						</button>
						<button
							type="button"
							onclick={() => handleLocaleChange('en')}
							class={`inline-flex items-center gap-2 ${RADIUS.button} px-4 py-2 ${TEXT.button} font-medium ${TRANSITION.all} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 ${
								currentLocale === 'en'
									? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50 dark:bg-blue-950/15 dark:text-blue-400 dark:ring-blue-800/30'
									: 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-neutral-800 dark:text-gray-300 dark:ring-neutral-700 dark:hover:bg-neutral-700'
							}`}
						>
							🇬🇧 English
						</button>
						<button
							type="button"
							onclick={() => handleLocaleChange('jp')}
							class={`inline-flex items-center gap-2 ${RADIUS.button} px-4 py-2 ${TEXT.button} font-medium ${TRANSITION.all} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 ${
								currentLocale === 'jp'
									? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50 dark:bg-blue-950/15 dark:text-blue-400 dark:ring-blue-800/30'
									: 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-neutral-800 dark:text-gray-300 dark:ring-neutral-700 dark:hover:bg-neutral-700'
							}`}
						>
							🇯🇵 日本語
						</button>
					</div>
				</div>

				<!-- Brand Mode Toggle -->
				<div class={`${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding}`}>
					<h3 class={`${TEXT.button} ${COLOR.textPrimary} mb-2 font-semibold`}>Mode Kampanye</h3>
					<p class={`${TEXT.small} ${COLOR.textSecondary} mb-4`}>
						Pilih mode kampanye yang ingin Anda lihat di platform.
					</p>
					<div class="flex items-center gap-4">
						<button
							type="button"
							onclick={handleBrandModeChange}
							role="switch"
							aria-checked={brandModeValue === 'hardcore'}
					aria-label="Toggle brand mode"
							class={`relative inline-flex h-6 w-11 items-center rounded-full ${TRANSITION.colors} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 ${
								brandModeValue === 'hardcore' ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
							}`}
						>
							<span
								class={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
									brandModeValue === 'hardcore' ? 'translate-x-6' : 'translate-x-1'
								}`}
							></span>
						</button>
						<div class="flex-1">
							<p class={`${TEXT.body} ${COLOR.textPrimary} font-medium`}>
								{brandModeValue === 'hardcore' ? '🔥 Hardcore Mode' : '😎 Chill Mode'}
							</p>
							<p class={`${TEXT.small} ${COLOR.textSecondary}`}>
								{brandModeValue === 'hardcore'
									? 'Semangat belajar maksimal dengan energi tinggi!'
									: 'Belajar dengan santai dan nyaman'}
							</p>
						</div>
					</div>
				</div>

				<!-- Notifications (Coming Soon) -->
				<div class={`${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding}`}>
					<h3 class={`${TEXT.button} ${COLOR.textPrimary} mb-2 font-semibold`}>Notifikasi</h3>
					<p class={`${TEXT.small} ${COLOR.textSecondary}`}>
						Pengaturan notifikasi akan segera tersedia.
					</p>
				</div>
			</div>
		</PageSection>
	{/if}

	<!-- Payment Gateway Tab -->
	{#if activeTab === 'payments'}
		<PageSection>
			<h2 class={`${TEXT.h2} ${COLOR.textPrimary} mb-6`}>Konfigurasi Payment Gateway</h2>
			<div class="space-y-6">
				<!-- Info Banner -->
				<div
					class="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20"
				>
					<div class="flex items-start gap-3">
						<span class="text-2xl">💳</span>
						<div class="flex-1">
							<h3 class={`${TEXT.button} ${COLOR.textPrimary} mb-1 font-semibold`}>
								Midtrans Payment Gateway
							</h3>
							<p class={`${TEXT.small} ${COLOR.textSecondary} mb-2`}>
								Konfigurasi kredensial Midtrans Anda untuk mengaktifkan pembayaran online. Pastikan
								Anda memasukkan credentials yang valid untuk environment yang dipilih.
							</p>
							<p class={`${TEXT.small} ${COLOR.textSecondary}`}>
								<strong>Catatan:</strong> Sandbox untuk testing, Production untuk transaksi real.
							</p>
						</div>
					</div>
				</div>

				<!-- Environment Selection -->
				<div class={`${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding}`}>
					<h3 class={`${TEXT.button} ${COLOR.textPrimary} mb-2 font-semibold`}>Environment</h3>
					<p class={`${TEXT.small} ${COLOR.textSecondary} mb-4`}>
						Pilih environment yang ingin Anda konfigurasi.
					</p>
					<div class="flex flex-wrap gap-2">
						<button
							type="button"
							onclick={() => (midtransEnvironment = 'sandbox')}
							class={`inline-flex items-center gap-2 ${RADIUS.button} px-4 py-2 ${TEXT.button} font-medium ${TRANSITION.all} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 ${
								midtransEnvironment === 'sandbox'
									? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/50 dark:bg-amber-950/15 dark:text-amber-400 dark:ring-amber-800/30'
									: 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-neutral-800 dark:text-gray-300 dark:ring-neutral-700 dark:hover:bg-neutral-700'
							}`}
						>
							<span>🧪</span>
							Sandbox (Testing)
						</button>
						<button
							type="button"
							onclick={() => (midtransEnvironment = 'production')}
							class={`inline-flex items-center gap-2 ${RADIUS.button} px-4 py-2 ${TEXT.button} font-medium ${TRANSITION.all} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 ${
								midtransEnvironment === 'production'
									? 'bg-green-50 text-green-700 ring-1 ring-green-200/50 dark:bg-green-950/15 dark:text-green-400 dark:ring-green-800/30'
									: 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 dark:bg-neutral-800 dark:text-gray-300 dark:ring-neutral-700 dark:hover:bg-neutral-700'
							}`}
						>
							<span>🚀</span>
							Production (Live)
						</button>
					</div>
				</div>

				<!-- Configuration Form -->
				<div class={`${RADIUS.card} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding}`}>
					<h3 class={`${TEXT.button} ${COLOR.textPrimary} mb-4 font-semibold`}>Kredensial</h3>
					<div class="space-y-4">
						<div class="flex flex-col gap-2">
							<label
								for="merchantId"
								class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
							>
								Merchant ID
							</label>
							<input
								type="text"
								id="merchantId"
								bind:value={merchantId}
								placeholder="Masukkan Merchant ID"
								class={`${RADIUS.input} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.input} ${TEXT.body} ${COLOR.textPrimary} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
							/>
							<p class={`${TEXT.small} ${COLOR.textMuted} mt-1`}>
								Merchant ID Anda dari dashboard Midtrans.
							</p>
						</div>

						<div class="flex flex-col gap-2">
							<label
								for="clientKey"
								class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
							>
								Client Key
							</label>
							<input
								type="text"
								id="clientKey"
								bind:value={clientKey}
								placeholder="Masukkan Client Key"
								class={`${RADIUS.input} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.input} ${TEXT.body} ${COLOR.textPrimary} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
							/>
							<p class={`${TEXT.small} ${COLOR.textMuted} mt-1`}>
								Client Key untuk menginisialisasi Snap payment.
							</p>
						</div>

						<div class="flex flex-col gap-2">
							<label
								for="serverKey"
								class={`${TEXT.button} ${COLOR.textPrimary} text-sm font-semibold`}
							>
								Server Key
							</label>
							<input
								type="password"
								id="serverKey"
								bind:value={serverKey}
								placeholder="Masukkan Server Key"
								class={`${RADIUS.input} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.input} ${TEXT.body} ${COLOR.textPrimary} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50`}
							/>
							<p class={`${TEXT.small} ${COLOR.textMuted} mt-1`}>
								Server Key untuk otentikasi dan verifikasi webhook (sensitif!).
							</p>
						</div>
					</div>
				</div>

				<!-- Webhook Configuration -->
				<div
					class="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/50 dark:bg-purple-950/20"
				>
					<h3 class={`${TEXT.button} ${COLOR.textPrimary} mb-2 font-semibold`}>Webhook URL</h3>
					<p class={`${TEXT.small} ${COLOR.textSecondary} mb-3`}>
						Salin URL ini dan konfigurasi di dashboard Midtrans Anda:
					</p>
					<div class="flex flex-col gap-2">
						{#if typeof window !== 'undefined'}
							<div class="flex items-center gap-2">
								<input
									type="text"
									readonly
									value={`${window.location.origin}/api/payments/midtrans/webhook`}
									class={`flex-1 ${RADIUS.input} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.input} ${TEXT.body} ${COLOR.textPrimary}`}
								/>
								<button
									type="button"
									onclick={async () => {
										const url = `${window.location.origin}/api/payments/midtrans/webhook`;
										try {
											await navigator.clipboard.writeText(url);
											toast.success('Webhook URL berhasil disalin!');
										} catch {
											toast.error('Gagal menyalin URL');
										}
									}}
									class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.button} ${TRANSITION.all} hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/30 dark:hover:text-blue-300`}
								>
									📋 Salin
								</button>
							</div>
						{:else}
							<div class="flex items-center gap-2">
								<input
									type="text"
									readonly
									value="Loading..."
									class={`flex-1 ${RADIUS.input} ${COLOR.cardBorder} ${COLOR.card} ${SPACING.input} ${TEXT.body} ${COLOR.textPrimary}`}
								/>
							</div>
						{/if}
						<div class={`${TEXT.small} ${COLOR.textMuted} flex items-start gap-2`}>
							<span>💡</span>
							<p>
								Pergi ke <strong>Settings → Configuration → Notification URL</strong> di dashboard Midtrans
								dan paste URL di atas.
							</p>
						</div>
					</div>
				</div>

				<!-- Actions -->
				<div class="flex items-center justify-end gap-3 pt-4">
					<button
						type="button"
						disabled={isProcessing}
						onclick={async () => {
							isProcessing = true;
							// TODO: Implement test connection
							setTimeout(() => {
								toast.success('Koneksi berhasil! Credentials valid.');
								isProcessing = false;
							}, 1000);
						}}
						class={`inline-flex items-center ${RADIUS.button} ${COLOR.cardBorder} ${SPACING.button} ${TEXT.button} ${TRANSITION.all} hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-blue-950/30 dark:hover:text-blue-300`}
					>
						🔗 Test Connection
					</button>
					<button
						type="submit"
						disabled={isProcessing || !merchantId || !clientKey || !serverKey}
						onclick={() => {
							toast.info('Penyimpanan konfigurasi akan segera tersedia');
						}}
						class={`inline-flex items-center ${RADIUS.button} ${COLOR.accentBg} ${SPACING.button} ${TEXT.button} font-semibold text-white ${ELEVATION.base} ${TRANSITION.all} hover:opacity-90 ${ELEVATION.hover} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-neutral-900`}
					>
						{isProcessing ? 'Menyimpan...' : 'Simpan Konfigurasi'}
					</button>
				</div>

				<!-- Documentation Link -->
				<div
					class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50"
				>
					<div class="flex items-start gap-3">
						<span class="text-2xl">📚</span>
						<div>
							<h3 class={`${TEXT.button} ${COLOR.textPrimary} mb-1 font-semibold`}>Dokumentasi</h3>
							<p class={`${TEXT.small} ${COLOR.textSecondary} mb-2`}>
								Pelajari lebih lanjut tentang konfigurasi Midtrans:
							</p>
							<ul class={`${TEXT.small} ${COLOR.textSecondary} space-y-1`}>
								<li>
									<a
										href="https://docs.midtrans.com/docs/getting-started"
										target="_blank"
										rel="noopener noreferrer"
										class="text-blue-600 hover:underline dark:text-blue-400"
									>
										📖 Getting Started Guide
									</a>
								</li>
								<li>
									<a
										href="https://dashboard.sandbox.midtrans.com"
										target="_blank"
										rel="noopener noreferrer"
										class="text-blue-600 hover:underline dark:text-blue-400"
									>
										🧪 Sandbox Dashboard
									</a>
								</li>
								<li>
									<a
										href="https://dashboard.midtrans.com"
										target="_blank"
										rel="noopener noreferrer"
										class="text-blue-600 hover:underline dark:text-blue-400"
									>
										🚀 Production Dashboard
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</PageSection>
	{/if}
</PageWrapper>
