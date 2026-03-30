<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import {
		COLOR,
		RADIUS,
		TEXT,
		TRANSITION,
		SPACING,
		ELEVATION,
		GRADIENT
	} from '$lib/config/design';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import StepWizard from '$lib/components/ui/StepWizard.svelte';
	import { toast } from '$lib/stores/toast';

	let { data, form }: { data: PageData; form: any } = $props();

	// Facilitator organization selection
	let selectedOrganization = $state<string | null>(data.invitedOrgId ?? null);

	// Storage key for persistence
	const STORAGE_KEY = 'naikkelas_onboarding_v1';

	// Helper function to load state from localStorage
	function loadPersistedState() {
		if (typeof window === 'undefined') return null;
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				return JSON.parse(saved);
			}
		} catch (e) {
			console.warn('Failed to load persisted onboarding state:', e);
		}
		return null;
	}

	// Helper function to save state to localStorage
	function savePersistedState(state: {
		currentStep: number;
		selectedGoal: string;
		selectedInterests: string[];
		experienceLevel: string;
		learningSchedule: string;
		selectedNotifications: string[];
	}) {
		if (typeof window === 'undefined') return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		} catch (e) {
			console.warn('Failed to save persisted onboarding state:', e);
		}
	}

	// Load persisted state on initialization
	const persistedState = loadPersistedState();

	// Wizard state
	let currentStep = $state(persistedState?.currentStep ?? 0);
	let isSubmitting = $state(false);

	// Telemetry state for students (with persisted values)
	let selectedGoal = $state(persistedState?.selectedGoal ?? '');
	let selectedInterests = $state(persistedState?.selectedInterests ?? []);
	let experienceLevel = $state(persistedState?.experienceLevel ?? '');
	let learningSchedule = $state(persistedState?.learningSchedule ?? '');
	let selectedNotifications = $state(persistedState?.selectedNotifications ?? ['email', 'wa']);

	// Watch for changes and auto-save
	$effect(() => {
		savePersistedState({
			currentStep,
			selectedGoal,
			selectedInterests,
			experienceLevel,
			learningSchedule,
			selectedNotifications
		});
	});

	// Show form errors as toasts
	$effect(() => {
		if (form?.error) {
			toast.error(form.error);
		}
	});

	// Check if this is an invitation flow
	let isInvitationFlow = $derived(!!data.invitedOrgId);

	// Calculate which steps are completed based on actual requirements
	let completedSteps = $derived(() => {
		const completed: number[] = [];

		// Step 0: Goals - completed if user has selected a goal
		if (selectedGoal) {
			completed.push(0);
		}

		// Step 1: Interests - completed if user has selected at least 1 interest
		if (selectedInterests.length > 0) {
			completed.push(1);
		}

		// Step 2: Experience & Schedule - completed if user has selected experience OR schedule
		// (at least one of them indicates engagement)
		if (experienceLevel || learningSchedule) {
			completed.push(2);
		}

		// Step 3: Review - completed only after form submission
		// (handled separately during submission)

		return completed;
	});

	// Highest completed step (for progress bar)
	let maxCompletedStep = $derived(() => {
		const completed = completedSteps();
		return completed.length > 0 ? Math.max(...completed) : -1;
	});

	// Clear persisted state (e.g., after successful submission)
	function clearPersistedState() {
		if (typeof window === 'undefined') return;
		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch (e) {
			console.warn('Failed to clear persisted onboarding state:', e);
		}
	}

	// Student onboarding steps
	const steps = [
		{ id: 'goals', label: 'Tujuan', icon: 'target' },
		{ id: 'interests', label: 'Minat', icon: 'heart' },
		{ id: 'experience', label: 'Pengalaman', icon: 'graduation' },
		{ id: 'review', label: 'Selesai', icon: 'check' }
	];

	// Goals options - Single selection
	const goalOptions = [
		{
			id: 'career-developer',
			label: 'Karir di Teknologi & Developer',
			description: 'Ingin menjadi developer profesional',
			icon: 'code',
			color: 'blue'
		},
		{
			id: 'career-akademik',
			label: 'Karir di Bidang Akademik',
			description: 'Ingin mengajar atau penelitian',
			icon: 'graduation',
			color: 'purple'
		},
		{
			id: 'career-bisnis',
			label: 'Karir di Bisnis & UMKM',
			description: 'Mengembangkan usaha sendiri',
			icon: 'shopping-cart',
			color: 'amber'
		},
		{
			id: 'career-design',
			label: 'Karir di Desain & Kreatif',
			description: 'Menjadi designer profesional',
			icon: 'palette',
			color: 'pink'
		},
		{
			id: 'career-outdoor',
			label: 'Outdoor & Leadership',
			description: 'Pengembangan leadership & outdoor',
			icon: 'mountain',
			color: 'teal'
		}
	];

	// Interests options - Max 5 selection
	const interestOptions = [
		// Developer
		{ id: 'web-dev', label: 'Web Development', icon: 'globe', domain: 'developer' },
		{ id: 'mobile-dev', label: 'Mobile Development', icon: 'smartphone', domain: 'developer' },
		{ id: 'ai-ml', label: 'AI & Machine Learning', icon: 'brain', domain: 'developer' },
		{ id: 'blockchain', label: 'Blockchain & Web3', icon: 'link', domain: 'developer' },

		// Akademik
		{ id: 'tutoring', label: 'Tutoring & Bimbingan', icon: 'book-open', domain: 'akademik' },
		{ id: 'course-creation', label: 'Pembuatan Kursus', icon: 'video', domain: 'akademik' },
		{ id: 'research', label: 'Penelitian & Riset', icon: 'microscope', domain: 'akademik' },
		{ id: 'academic-mentor', label: 'Mentoring Akademik', icon: 'award', domain: 'akademik' },

		// Bisnis
		{ id: 'product-dev', label: 'Pengembangan Produk', icon: 'package', domain: 'bisnis' },
		{ id: 'marketing', label: 'Marketing & Branding', icon: 'megaphone', domain: 'bisnis' },
		{ id: 'operations', label: 'Operasional Bisnis', icon: 'settings', domain: 'bisnis' },
		{ id: 'e-commerce', label: 'E-Commerce', icon: 'shopping-bag', domain: 'bisnis' },

		// Design
		{ id: 'ui-ux', label: 'UI/UX Design', icon: 'layout', domain: 'design' },
		{ id: 'graphic-design', label: 'Graphic Design', icon: 'image', domain: 'design' },
		{ id: 'motion-design', label: 'Motion Design', icon: 'zap', domain: 'design' },

		// Outdoor
		{ id: 'leadership', label: 'Leadership Training', icon: 'target', domain: 'outdoor' },
		{ id: 'expedition', label: 'Expedition Planning', icon: 'compass', domain: 'outdoor' }
	];

	// Experience options
	const experienceOptions = [
		{ id: 'beginner', label: 'Pemula', description: 'Baru mulai belajar' },
		{ id: 'intermediate', label: 'Menengah', description: 'Sudah paham dasar' },
		{ id: 'advanced', label: 'Lanjutan', description: 'Punya pengalaman' }
	];

	// Schedule options
	const scheduleOptions = [
		{ id: 'morning', label: 'Pagi', time: '06:00 - 12:00' },
		{ id: 'afternoon', label: 'Siang', time: '12:00 - 18:00' },
		{ id: 'evening', label: 'Malam', time: '18:00 - 23:00' },
		{ id: 'flexible', label: 'Fleksibel', time: 'Kapan saja' }
	];

	// Notification options
	const notificationOptions = [
		{ id: 'email', label: 'Email' },
		{ id: 'wa', label: 'WhatsApp' },
		{ id: 'push', label: 'Push Notification' }
	];

	// Get interest options by domain
	function getInterestsByDomain(domain: string) {
		return interestOptions.filter((i) => i.domain === domain);
	}

	// Toggle interest selection (max 5)
	function toggleInterest(interestId: string) {
		if (selectedInterests.includes(interestId)) {
			selectedInterests = selectedInterests.filter((i: string) => i !== interestId);
		} else if (selectedInterests.length < 5) {
			selectedInterests = [...selectedInterests, interestId];
		}
	}

	// Toggle notification selection
	function toggleNotification(notifId: string) {
		if (selectedNotifications.includes(notifId)) {
			selectedNotifications = selectedNotifications.filter((n: string) => n !== notifId);
		} else {
			selectedNotifications = [...selectedNotifications, notifId];
		}
	}

	// Navigation functions
	function nextStep() {
		if (currentStep < steps.length - 1) {
			currentStep++;
		}
	}

	function prevStep() {
		if (currentStep > 0) {
			currentStep--;
		}
	}

	// Validation for each step
	// All fields are optional - users can skip any step
	function canProceedToNext(): boolean {
		switch (currentStep) {
			case 0: // Goals (optional)
				return true;
			case 1: // Interests (optional, but at least 1 if they select anything)
				return true;
			case 2: // Experience & Schedule (optional)
				return true;
			default:
				return true;
		}
	}

	// Get step title based on current step
	function getStepTitle(): string {
		switch (currentStep) {
			case 0:
				return 'Pilih Tujuan Utama';
			case 1:
				return 'Pilih Minat Anda';
			case 2:
				return 'Pengalaman & Jadwal';
			case 3:
				return 'Konfirmasi Preferensi';
			default:
				return '';
		}
	}

	// Get step description based on current step
	function getStepDescription(): string {
		switch (currentStep) {
			case 0:
				return 'Pilih satu tujuan utama yang paling relevan dengan Anda';
			case 1:
				return `Pilih hingga 5 bidang minat (${selectedInterests.length}/5 dipilih)`;
			case 2:
				return 'Tentukan tingkat pengalaman dan jadwal belajar ideal';
			case 3:
				return 'Review preferensi Anda sebelum melanjutkan';
			default:
				return '';
		}
	}

	// Get goal color class
	function getGoalColorClass(color: string): string {
		const colorMap: Record<string, string> = {
			blue: 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/10 dark:bg-blue-900/20',
			purple: 'border-purple-500 bg-purple-50 ring-2 ring-purple-500/10 dark:bg-purple-900/20',
			amber: 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/10 dark:bg-amber-900/20',
			pink: 'border-pink-500 bg-pink-50 ring-2 ring-pink-500/10 dark:bg-pink-900/20',
			teal: 'border-teal-500 bg-teal-50 ring-2 ring-teal-500/10 dark:bg-teal-900/20'
		};
		return colorMap[color] || colorMap['blue'];
	}

	function getGoalColorText(color: string): string {
		const colorMap: Record<string, string> = {
			blue: 'text-blue-600',
			purple: 'text-purple-600',
			amber: 'text-amber-600',
			pink: 'text-pink-600',
			teal: 'text-teal-600'
		};
		return colorMap[color] || colorMap['blue'];
	}

	function getGoalColorBg(color: string): string {
		const colorMap: Record<string, string> = {
			blue: 'bg-blue-500/10',
			purple: 'bg-purple-500/10',
			amber: 'bg-amber-500/10',
			pink: 'bg-pink-500/10',
			teal: 'bg-teal-500/10'
		};
		return colorMap[color] || colorMap['blue'];
	}

	// Summary computed values
	let goalSummary = $derived(
		goalOptions.find((g) => g.id === selectedGoal)?.label || 'Belum dipilih'
	);
	let interestsSummary = $derived(
		selectedInterests.length > 0
			? selectedInterests
					.map((id: string) => interestOptions.find((i) => i.id === id)?.label)
					.join(', ')
			: 'Belum dipilih'
	);
	let experienceSummary = $derived(
		experienceOptions.find((e) => e.id === experienceLevel)?.label || 'Belum dipilih'
	);
	let scheduleSummary = $derived(
		scheduleOptions.find((s) => s.id === learningSchedule)?.label || 'Belum dipilih'
	);
</script>

<svelte:head>
	<title>Onboarding - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-4xl">
		<main class="space-y-8 py-12">
			<!-- Header -->
			<header class="space-y-4 text-center">
				<div
					class="inline-flex h-7 items-center gap-2 rounded-full border border-blue-500/10 bg-blue-500/10 px-3 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
				>
					<Icon name="sparkle" size={13} strokeWidth={2.5} />
					<span class={`${TEXT.small} translate-y-[0.5px] leading-none font-bold`}>
						{isInvitationFlow ? 'Undangan Diterima' : 'Pengaturan Awal'}
					</span>
				</div>

				{#if data.role === 'mentor'}
					<h1 class={`${TEXT.h1} ${COLOR.textPrimary}`}>Selamat Datang, Expert Mentor! 🎓</h1>
					<p class={`${TEXT.secondary} mx-auto max-w-2xl`}>
						{isInvitationFlow
							? `Anda telah diundang untuk menjadi mentor. Lengkapi aktivasi akademi kamu untuk mulai membagikan ilmu.`
							: 'Lengkapi aktivasi akademi kamu untuk mulai membagikan ilmu dan membimbing generasi digital masa depan.'}
					</p>
				{:else if data.role === 'facilitator'}
					<h1 class={`${TEXT.h1} ${COLOR.textPrimary}`}>
						{isInvitationFlow ? 'Undangan Diterima! 👋' : 'Halo, Learning Facilitator! 👋'}
					</h1>
					<p class={`${TEXT.secondary} mx-auto max-w-2xl`}>
						{isInvitationFlow
							? 'Anda telah diundang untuk menjadi fasilitator. Aktivasi akun untuk mulai mendampingi.'
							: 'Siapkan pusat fasilitasi kamu untuk mendampingi setiap batch dalam perjalanan transformasi digital mereka.'}
					</p>
				{:else}
					<h1 class={`${TEXT.h1} ${COLOR.textPrimary}`}>Selamat Datang di Naik Kelas! 🚀</h1>
					<p class={`${TEXT.secondary} mx-auto max-w-2xl`}>
						Bantu kami memahami preferensi belajar Anda untuk pengalaman yang lebih personal.
					</p>
				{/if}
			</header>

			{#if data.role === 'mentor'}
				<!-- Mentor Onboarding Node -->
				<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
					<div class={`space-y-6 md:col-span-2`}>
						<div
							class={`${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} space-y-8`}
						>
							<div class="space-y-2">
								{#if isInvitationFlow}
									<h2 class={`${TEXT.h3} ${COLOR.textPrimary}`}>
										Selamat Datang, Expert Mentor! Undangan Diterima
									</h2>
									<p class={TEXT.secondary}>
										Anda telah diundang untuk menjadi mentor di {data.organizations[0]?.name}.
										Lengkapi profil untuk memulai.
									</p>
								{:else}
									<h2 class={`${TEXT.h3} ${COLOR.textPrimary}`}>Aktivasi Akademi Expert</h2>
									<p class={TEXT.secondary}>
										Konfigurasi profil mentor kamu untuk visibilitas maksimal.
									</p>
								{/if}
							</div>

							{#if isInvitationFlow}
								<div
									class={`${RADIUS.card} border border-indigo-200 bg-indigo-50 p-6 dark:border-indigo-800 dark:bg-indigo-900/20`}
								>
									<div class="flex items-start gap-4">
										<div
											class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-600"
										>
											<Icon name="gift" size={24} />
										</div>
										<div>
											<h4 class={`${TEXT.h4} text-indigo-800 dark:text-indigo-200`}>
												Keuntungan sebagai Mentor
											</h4>
											<ul class="mt-2 space-y-1 text-sm text-indigo-700 dark:text-indigo-300">
												<li>✓ Akses dashboard mentor khusus</li>
												<li>✓ Komisi affiliate otomatis (25%)</li>
												<li>✓ Link undangan bisa dibagikan</li>
												<li>✓ Analisis performa siswa</li>
											</ul>
										</div>
									</div>
								</div>
							{/if}

							<div class="grid grid-cols-1 gap-6">
								<div class="flex items-start gap-4 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
									<div
										class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-500"
									>
										<Icon name="user" size={20} />
									</div>
									<div>
										<h4 class={TEXT.h4}>Verifikasi Profil</h4>
										<p class={TEXT.muted}>Lengkapi nama lengkap, bio, dan foto profil kamu.</p>
									</div>
								</div>

								<div class="flex items-start gap-4 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
									<div
										class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-500"
									>
										<Icon name="graduation" size={20} />
									</div>
									<div>
										<h4 class={TEXT.h4}>Keahlian & Portfolio</h4>
										<p class={TEXT.muted}>
											Tambahkan keahlian, pengalaman, dan link portfolio kamu.
										</p>
									</div>
								</div>

								<div class="flex items-start gap-4 rounded-2xl bg-blue-50 p-4 dark:bg-blue-900/20">
									<div
										class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-500"
									>
										<Icon name="settings" size={20} />
									</div>
									<div>
										<h4 class={TEXT.h4}>Preferensi Mentor</h4>
										<p class={TEXT.muted}>
											Atur preferensi notifikasi dan metode pembayaran komisi.
										</p>
									</div>
								</div>
							</div>

							<form method="POST" action="?/redirectToSettings" use:enhance>
								<AuthSubmitButton
									text={isInvitationFlow
										? 'Lengkapi Profil & Masuk'
										: 'Lengkapi Profil di Settings'}
								/>
							</form>
						</div>
					</div>

					<aside class="space-y-6">
						<div class={`${RADIUS.card} ${GRADIENT.primary} space-y-4 p-8 text-white shadow-xl`}>
							<Icon name="info" size={32} />
							<h4 class={TEXT.h4}>Kenapa Mentor?</h4>
							<p class="text-sm leading-relaxed font-medium opacity-80">
								Sebagai Mentor di Naik Kelas, Anda memiliki akses ke alat analisis performa siswa
								dan manajemen kurikulum yang canggih.
							</p>
						</div>
					</aside>
				</div>
			{:else if data.role === 'facilitator'}
				<!-- Facilitator Onboarding Node -->
				<div class="mx-auto max-w-2xl">
					<div
						class={`${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} space-y-8`}
					>
						<div class="text-center">
							<div
								class="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-500"
							>
								<Icon name="users" size={40} />
							</div>

							<div class="space-y-2">
								{#if isInvitationFlow}
									<h2 class={`${TEXT.h2} ${COLOR.textPrimary}`}>
										Selamat Datang! Undangan Diterima
									</h2>
									<p class={TEXT.secondary}>
										Anda telah diundang untuk menjadi fasilitator di {data.organizations[0]?.name}.
									</p>
								{:else}
									<h2 class={`${TEXT.h2} ${COLOR.textPrimary}`}>Kesiapan Fasilitasi</h2>
									<p class={TEXT.secondary}>Pusat kendali fasilitasi kamu hampir siap digunakan.</p>
								{/if}
							</div>
						</div>

						{#if isInvitationFlow}
							<div
								class={`${RADIUS.card} border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20`}
							>
								<div class="flex items-center gap-3">
									<div
										class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600"
									>
										<Icon name="building" size={20} />
									</div>
									<div>
										<p class="text-sm font-medium text-emerald-800 dark:text-emerald-200">
											Organisasi:
										</p>
										<p class="font-bold text-emerald-900 dark:text-emerald-100">
											{data.organizations[0]?.name}
										</p>
									</div>
								</div>
							</div>
						{:else}
							<p class={`${TEXT.body} ${COLOR.textSecondary} text-center`}>
								Anda akan membimbing kelompok belajar (batch) melalui materi yang disediakan oleh
								Expert Mentor. Pilih organisasi yang ingin Anda fasilitasi.
							</p>

							{#if data.organizations && data.organizations.length > 0}
								<div class="space-y-3">
									<p class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}>Pilih Organisasi</p>
									<div class="grid grid-cols-1 gap-3">
										{#each data.organizations as org}
											<button
												type="button"
												class={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
													selectedOrganization === org.id
														? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-500/10 dark:bg-emerald-900/20'
														: 'border-zinc-200 hover:border-emerald-500/30 dark:border-zinc-700 dark:hover:border-emerald-500/30'
												}`}
												onclick={() => (selectedOrganization = org.id)}
											>
												<div
													class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600"
												>
													<Icon name="building" size={20} />
												</div>
												<div class="flex-1">
													<h4 class="font-bold">{org.name}</h4>
													<p class="text-xs text-zinc-500">/{org.slug}</p>
												</div>
												{#if selectedOrganization === org.id}
													<Icon name="check" size={20} class="text-emerald-500" />
												{/if}
											</button>
										{/each}
									</div>
								</div>
							{/if}
						{/if}

						<form method="POST" action="?/completeOnboarding" use:enhance>
							<input type="hidden" name="organizationId" value={selectedOrganization ?? ''} />
							<AuthSubmitButton
								text="Buka Dashboard Fasilitator"
								disabled={!selectedOrganization}
							/>
						</form>
					</div>
				</div>
			{:else}
				<!-- Student (User) Onboarding - Multi-Step Wizard -->
				<div class="space-y-8">
					<!-- Progress Bar -->
					<StepWizard bind:currentStep {steps} maxCompletedStep={maxCompletedStep()} />

					<!-- Step Content -->
					<div
						class={`${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} space-y-8`}
					>
						<!-- Step Header -->
						<div class="space-y-2 text-center">
							<h2 class={`${TEXT.h3} ${COLOR.textPrimary}`}>{getStepTitle()}</h2>
							<p class={TEXT.secondary}>{getStepDescription()}</p>
						</div>

						<!-- Step 1: Goals -->
						{#if currentStep === 0}
							<div class="space-y-4">
								<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
									{#each goalOptions as goal}
										<button
											type="button"
											class={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
												selectedGoal === goal.id
													? getGoalColorClass(goal.color)
													: 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600'
											}`}
											onclick={() => (selectedGoal = goal.id)}
										>
											<div
												class={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${getGoalColorBg(goal.color)} ${getGoalColorText(goal.color)}`}
											>
												<Icon name={goal.icon} size={24} />
											</div>
											<div class="flex-1 space-y-1">
												<h4 class="font-semibold text-zinc-900 dark:text-zinc-100">
													{goal.label}
												</h4>
												<p class="text-xs text-zinc-500 dark:text-zinc-400">
													{goal.description}
												</p>
											</div>
											{#if selectedGoal === goal.id}
												<Icon name="check" size={20} class={getGoalColorText(goal.color)} />
											{/if}
										</button>
									{/each}
								</div>
							</div>
						{/if}

						<!-- Step 2: Interests -->
						{#if currentStep === 1}
							<div class="space-y-6">
								<!-- Domain: Developer -->
								<div class="space-y-3">
									<p
										class="flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400"
									>
										<span class="h-2 w-2 rounded-full bg-blue-500"></span> Developer
									</p>
									<div class="flex flex-wrap gap-2">
										{#each getInterestsByDomain('developer') as interest}
											<button
												type="button"
												class={`flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm transition-all ${
													selectedInterests.includes(interest.id)
														? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
														: 'border-zinc-200 hover:border-blue-500/30 dark:border-zinc-700 dark:hover:border-blue-500/30'
												}`}
												onclick={() => toggleInterest(interest.id)}
											>
												<Icon name={interest.icon} size={16} />
												{interest.label}
											</button>
										{/each}
									</div>
								</div>

								<!-- Domain: Akademik -->
								<div class="space-y-3">
									<p
										class="flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400"
									>
										<span class="h-2 w-2 rounded-full bg-purple-500"></span> Akademik
									</p>
									<div class="flex flex-wrap gap-2">
										{#each getInterestsByDomain('akademik') as interest}
											<button
												type="button"
												class={`flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm transition-all ${
													selectedInterests.includes(interest.id)
														? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
														: 'border-zinc-200 hover:border-purple-500/30 dark:border-zinc-700 dark:hover:border-purple-500/30'
												}`}
												onclick={() => toggleInterest(interest.id)}
											>
												<Icon name={interest.icon} size={16} />
												{interest.label}
											</button>
										{/each}
									</div>
								</div>

								<!-- Domain: Bisnis -->
								<div class="space-y-3">
									<p
										class="flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400"
									>
										<span class="h-2 w-2 rounded-full bg-amber-500"></span> Bisnis & UMKM
									</p>
									<div class="flex flex-wrap gap-2">
										{#each getInterestsByDomain('bisnis') as interest}
											<button
												type="button"
												class={`flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm transition-all ${
													selectedInterests.includes(interest.id)
														? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
														: 'border-zinc-200 hover:border-amber-500/30 dark:border-zinc-700 dark:hover:border-amber-500/30'
												}`}
												onclick={() => toggleInterest(interest.id)}
											>
												<Icon name={interest.icon} size={16} />
												{interest.label}
											</button>
										{/each}
									</div>
								</div>

								<!-- Domain: Design & Outdoor in grid -->
								<div class="grid grid-cols-2 gap-6">
									<!-- Design -->
									<div class="space-y-3">
										<p
											class="flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400"
										>
											<span class="h-2 w-2 rounded-full bg-pink-500"></span> Design
										</p>
										<div class="flex flex-wrap gap-2">
											{#each getInterestsByDomain('design') as interest}
												<button
													type="button"
													class={`flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-xs transition-all ${
														selectedInterests.includes(interest.id)
															? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
															: 'border-zinc-200 hover:border-pink-500/30 dark:border-zinc-700 dark:hover:border-pink-500/30'
													}`}
													onclick={() => toggleInterest(interest.id)}
												>
													<Icon name={interest.icon} size={14} />
													{interest.label}
												</button>
											{/each}
										</div>
									</div>

									<!-- Outdoor -->
									<div class="space-y-3">
										<p
											class="flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400"
										>
											<span class="h-2 w-2 rounded-full bg-teal-500"></span> Outdoor
										</p>
										<div class="flex flex-wrap gap-2">
											{#each getInterestsByDomain('outdoor') as interest}
												<button
													type="button"
													class={`flex items-center gap-2 rounded-full border-2 px-3 py-1.5 text-xs transition-all ${
														selectedInterests.includes(interest.id)
															? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
															: 'border-zinc-200 hover:border-teal-500/30 dark:border-zinc-700 dark:hover:border-teal-500/30'
													}`}
													onclick={() => toggleInterest(interest.id)}
												>
													<Icon name={interest.icon} size={14} />
													{interest.label}
												</button>
											{/each}
										</div>
									</div>
								</div>

								<!-- Progress indicator for interests -->
								<div class="flex items-center justify-center gap-2 pt-2">
									<div
										class={`h-2 rounded-full ${selectedInterests.length >= 1 ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'} w-8 transition-all`}
									></div>
									<div
										class={`h-2 rounded-full ${selectedInterests.length >= 2 ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'} w-8 transition-all`}
									></div>
									<div
										class={`h-2 rounded-full ${selectedInterests.length >= 3 ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'} w-8 transition-all`}
									></div>
									<div
										class={`h-2 rounded-full ${selectedInterests.length >= 4 ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'} w-8 transition-all`}
									></div>
									<div
										class={`h-2 rounded-full ${selectedInterests.length >= 5 ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-700'} w-8 transition-all`}
									></div>
									<p class={`${TEXT.muted} ml-2`}>
										{selectedInterests.length}/5 dipilih
									</p>
								</div>
							</div>
						{/if}

						<!-- Step 3: Experience & Schedule -->
						{#if currentStep === 2}
							<div class="space-y-8">
								<!-- Experience Level -->
								<div class="space-y-4">
									<p class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}>
										Tingkat pengalaman Anda
									</p>
									<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
										{#each experienceOptions as exp}
											<button
												type="button"
												class={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
													experienceLevel === exp.id
														? 'border-purple-500 bg-purple-50 ring-4 ring-purple-500/10 dark:bg-purple-900/20'
														: 'border-zinc-200 hover:border-purple-500/30 dark:border-zinc-700 dark:hover:border-purple-500/30'
												}`}
												onclick={() => (experienceLevel = exp.id)}
											>
												<span class="text-sm font-bold">{exp.label}</span>
												<span class="text-xs text-zinc-500">{exp.description}</span>
												{#if experienceLevel === exp.id}
													<Icon
														name="check"
														size={16}
														class="absolute top-2 right-2 text-purple-500"
													/>
												{/if}
											</button>
										{/each}
									</div>
								</div>

								<!-- Learning Schedule -->
								<div class="space-y-4">
									<p class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}>
										Waktu belajar ideal Anda
									</p>
									<div class="grid grid-cols-1 gap-3 sm:grid-cols-4">
										{#each scheduleOptions as schedule}
											<button
												type="button"
												class={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
													learningSchedule === schedule.id
														? 'border-amber-500 bg-amber-50 ring-4 ring-amber-500/10 dark:bg-amber-900/20'
														: 'border-zinc-200 hover:border-amber-500/30 dark:border-zinc-700 dark:hover:border-amber-500/30'
												}`}
												onclick={() => (learningSchedule = schedule.id)}
											>
												<span class="text-sm font-bold">{schedule.label}</span>
												<span class="text-xs text-zinc-500">{schedule.time}</span>
												{#if learningSchedule === schedule.id}
													<Icon
														name="check"
														size={16}
														class="absolute top-2 right-2 text-amber-500"
													/>
												{/if}
											</button>
										{/each}
									</div>
								</div>

								<!-- Notification Preferences -->
								<div class="space-y-4">
									<p class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}>
										Ingin mendapat notifikasi melalui?
									</p>
									<div class="flex flex-wrap gap-3">
										{#each notificationOptions as notif}
											<button
												type="button"
												class={`flex items-center gap-2 rounded-full border-2 px-4 py-2 transition-all ${
													selectedNotifications.includes(notif.id)
														? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
														: 'border-zinc-200 hover:border-rose-500/30 dark:border-zinc-700 dark:hover:border-rose-500/30'
												}`}
												onclick={() => toggleNotification(notif.id)}
											>
												<Icon
													name={notif.id === 'email'
														? 'mail'
														: notif.id === 'wa'
															? 'message-circle'
															: 'bell'}
													size={16}
												/>
												<span class="text-sm font-medium">{notif.label}</span>
											</button>
										{/each}
									</div>
								</div>
							</div>
						{/if}

						<!-- Step 4: Review -->
						{#if currentStep === 3}
							<div class="space-y-6">
								<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<!-- Goal Summary -->
									<div
										class={`${RADIUS.card} border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50`}
									>
										<div class="mb-3 flex items-center gap-3">
											<div
												class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-600"
											>
												<Icon name="target" size={20} />
											</div>
											<h4 class={TEXT.h4}>Tujuan Utama</h4>
										</div>
										<p class="font-medium text-zinc-900 dark:text-zinc-100">{goalSummary}</p>
									</div>

									<!-- Interests Summary -->
									<div
										class={`${RADIUS.card} border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50`}
									>
										<div class="mb-3 flex items-center gap-3">
											<div
												class="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-600"
											>
												<Icon name="heart" size={20} />
											</div>
											<h4 class={TEXT.h4}>Minat ({selectedInterests.length}/5)</h4>
										</div>
										<p class="text-sm font-medium text-zinc-900 dark:text-zinc-100">
											{interestsSummary}
										</p>
									</div>

									<!-- Experience Summary -->
									<div
										class={`${RADIUS.card} border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50`}
									>
										<div class="mb-3 flex items-center gap-3">
											<div
												class="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-600"
											>
												<Icon name="graduation" size={20} />
											</div>
											<h4 class={TEXT.h4}>Pengalaman</h4>
										</div>
										<p class="font-medium text-zinc-900 dark:text-zinc-100">{experienceSummary}</p>
									</div>

									<!-- Schedule Summary -->
									<div
										class={`${RADIUS.card} border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50`}
									>
										<div class="mb-3 flex items-center gap-3">
											<div
												class="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-600"
											>
												<Icon name="clock" size={20} />
											</div>
											<h4 class={TEXT.h4}>Jadwal Belajar</h4>
										</div>
										<p class="font-medium text-zinc-900 dark:text-zinc-100">{scheduleSummary}</p>
									</div>
								</div>

								<!-- Notification Summary -->
								<div
									class={`${RADIUS.card} border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50`}
								>
									<div class="mb-3 flex items-center gap-3">
										<div
											class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600"
										>
											<Icon name="bell" size={20} />
										</div>
										<h4 class={TEXT.h4}>Notifikasi</h4>
									</div>
									<div class="flex flex-wrap gap-2">
										{#each selectedNotifications as notif}
											<span
												class="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-400"
											>
												{notif === 'email' ? 'Email' : notif === 'wa' ? 'WhatsApp' : 'Push'}
											</span>
										{/each}
									</div>
								</div>

								<p class={`${TEXT.muted} text-center`}>
									Klik "Selesaikan" untuk menyimpan preferensi Anda. Progress otomatis tersimpan.
								</p>
							</div>
						{/if}
					</div>

					<!-- Navigation Buttons -->
					<div class="flex items-center justify-between gap-4">
						{#if currentStep > 0}
							<button
								type="button"
								class={`flex items-center gap-2 rounded-xl border-2 px-5 py-2.5 font-medium transition-all ${COLOR.accentHover} ${RADIUS.button}`}
								onclick={prevStep}
							>
								<Icon name="arrow-left" size={18} />
								Kembali
							</button>
						{:else}
							<div></div>
						{/if}

						{#if currentStep < steps.length - 1}
							<button
								type="button"
								class={`flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 font-medium text-white transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 ${RADIUS.button} ${!canProceedToNext() ? 'cursor-not-allowed opacity-50' : ''}`}
								disabled={!canProceedToNext()}
								onclick={nextStep}
							>
								Selanjutnya
								<Icon name="arrow-right" size={18} />
							</button>
						{:else}
							<form
								method="POST"
								action="?/savePreferences"
								use:enhance={() => {
									isSubmitting = true;
									return async ({ result, update }) => {
										isSubmitting = false;
										if (result.type === 'success') {
											toast.success('Preferensi berhasil disimpan!');
										} else if (result.type === 'failure') {
											const msg = String(result.data?.error || 'Gagal menyimpan preferensi');
											toast.error(msg);
										}
										await update();
										clearPersistedState();
									};
								}}
							>
								<input
									type="hidden"
									name="goals"
									value={selectedGoal ? JSON.stringify([selectedGoal]) : '[]'}
								/>
								<input type="hidden" name="interests" value={JSON.stringify(selectedInterests)} />
								<input type="hidden" name="experienceLevel" value={experienceLevel} />
								<input type="hidden" name="learningSchedule" value={learningSchedule} />
								<input
									type="hidden"
									name="notificationPrefs"
									value={JSON.stringify(selectedNotifications)}
								/>
								<button
									type="submit"
									disabled={isSubmitting}
									class={`${COLOR.accentBg} ${COLOR.accentHover} ${RADIUS.button} ${TEXT.button} ${SPACING.button} flex items-center gap-2 text-white disabled:cursor-not-allowed disabled:opacity-50`}
								>
									{#if isSubmitting}
										<span class="animate-spin">
											<Icon name="loader" size={18} />
										</span>
									{/if}
									Selesaikan & Mulai
									<Icon name="check" size={18} />
								</button>
							</form>
						{/if}
					</div>
				</div>
			{/if}
		</main>
	</div>
</PageWrapper>
