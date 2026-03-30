<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import {
		COLOR,
		RADIUS,
		TEXT,
		TRANSITION,
		SPACING,
		GRADIENT,
		ELEVATION
	} from '$lib/config/design';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import AuthMessage from '$lib/components/AuthMessage.svelte';
	import AuthSubmitButton from '$lib/components/AuthSubmitButton.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	let { data, form }: { data: PageData; form: any } = $props();

	// Facilitator organization selection - auto-select if invited
	let selectedOrganization = $state<string | null>(data.invitedOrgId ?? null);

	// Check if this is an invitation flow
	let isInvitationFlow = $derived(!!data.invitedOrgId);

	// Telemetry state for students
	let selectedGoals = $state<string[]>([]);
	let selectedInterests = $state<string[]>([]);
	let experienceLevel = $state<string>('');
	let learningSchedule = $state<string>('');
	let selectedNotifications = $state<string[]>(['email', 'wa']);

	// Options for telemetry questions - Expanded to support all platform domains
	const goalOptions = [
		// Career paths based on platform domains
		{
			id: 'career-developer',
			label: 'Karir di Teknologi & Developer',
			icon: 'code',
			domain: 'developer'
		},
		{
			id: 'career-akademik',
			label: 'Karir di Bidang Akademik',
			icon: 'graduation',
			domain: 'akademik'
		},
		{
			id: 'career-bisnis',
			label: 'Karir di Bisnis & UMKM',
			icon: 'shopping-cart',
			domain: 'bisnis'
		},
		{ id: 'career-design', label: 'Karir di Desain & Kreatif', icon: 'palette', domain: 'design' },
		{
			id: 'career-outdoor',
			label: 'Karir di Outdoor & Leadership',
			icon: 'mountain',
			domain: 'outdoor'
		},
		// Monetization & collaboration paths
		{
			id: 'monetize-knowledge',
			label: 'Monetisasi Pengetahuan',
			icon: 'dollar',
			domain: 'general'
		},
		{
			id: 'build-organization',
			label: 'Membangun Organisasi/Institusi',
			icon: 'building',
			domain: 'general'
		},
		{ id: 'kolaborasi', label: 'Kolaborasi & Bermitra', icon: 'users', domain: 'general' },
		{
			id: 'mentor-facilitator',
			label: 'Menjadi Mentor/Facilitator',
			icon: 'star',
			domain: 'general'
		}
	];

	const interestOptions = [
		// Developer interests
		{ id: 'web-dev', label: 'Web Development', icon: 'globe', domain: 'developer' },
		{ id: 'mobile-dev', label: 'Mobile Development', icon: 'smartphone', domain: 'developer' },
		{ id: 'ai-ml', label: 'AI & Machine Learning', icon: 'brain', domain: 'developer' },
		{ id: 'blockchain', label: 'Blockchain & Web3', icon: 'link', domain: 'developer' },

		// Akademik interests
		{ id: 'tutoring', label: 'Tutoring & Bimbingan', icon: 'book-open', domain: 'akademik' },
		{ id: 'course-creation', label: 'Pembuatan Kursus', icon: 'video', domain: 'akademik' },
		{ id: 'research', label: 'Penelitian & Riset', icon: 'microscope', domain: 'akademik' },
		{ id: 'academic-mentor', label: 'Mentoring Akademik', icon: 'award', domain: 'akademik' },

		// Bisnis & UMKM interests
		{ id: 'product-dev', label: 'Pengembangan Produk', icon: 'package', domain: 'bisnis' },
		{ id: 'marketing', label: 'Marketing & Branding', icon: 'megaphone', domain: 'bisnis' },
		{ id: 'operations', label: 'Operasional Bisnis', icon: 'settings', domain: 'bisnis' },
		{ id: 'e-commerce', label: 'E-Commerce', icon: 'shopping-bag', domain: 'bisnis' },
		{ id: 'affiliate', label: 'Affiliate Marketing', icon: 'link', domain: 'bisnis' },

		// Design interests
		{ id: 'ui-ux', label: 'UI/UX Design', icon: 'layout', domain: 'design' },
		{ id: 'graphic-design', label: 'Graphic Design', icon: 'image', domain: 'design' },
		{ id: 'motion-design', label: 'Motion Design', icon: 'zap', domain: 'design' },
		{ id: 'design-systems', label: 'Design Systems', icon: 'pen-tool', domain: 'design' },

		// Outdoor interests
		{ id: 'leadership', label: 'Leadership Training', icon: 'target', domain: 'outdoor' },
		{ id: 'expedition', label: 'Expedition Planning', icon: 'compass', domain: 'outdoor' },
		{ id: 'team-building', label: 'Team Building', icon: 'handshake', domain: 'outdoor' },
		{ id: 'adventure-education', label: 'Adventure Education', icon: 'sun', domain: 'outdoor' }
	];

	const experienceOptions = [
		{ id: 'beginner', label: 'Pemula', description: 'Baru mulai belajar' },
		{ id: 'intermediate', label: 'Menengah', description: 'Sudah paham dasar' },
		{ id: 'advanced', label: 'Lanjutan', description: 'Punya pengalaman' }
	];

	const scheduleOptions = [
		{ id: 'morning', label: 'Pagi', time: '06:00 - 12:00' },
		{ id: 'afternoon', label: 'Siang', time: '12:00 - 18:00' },
		{ id: 'evening', label: 'Malam', time: '18:00 - 23:00' },
		{ id: 'flexible', label: 'Fleksibel', time: 'Kapan saja' }
	];

	const notificationOptions = [
		{ id: 'email', label: 'Email' },
		{ id: 'wa', label: 'WhatsApp' },
		{ id: 'push', label: 'Push Notification' }
	];

	// Toggle goal selection
	function toggleGoal(goalId: string) {
		if (selectedGoals.includes(goalId)) {
			selectedGoals = selectedGoals.filter((g) => g !== goalId);
		} else {
			selectedGoals = [...selectedGoals, goalId];
		}
	}

	// Toggle interest selection
	function toggleInterest(interestId: string) {
		if (selectedInterests.includes(interestId)) {
			selectedInterests = selectedInterests.filter((i) => i !== interestId);
		} else {
			selectedInterests = [...selectedInterests, interestId];
		}
	}

	// Toggle notification selection
	function toggleNotification(notifId: string) {
		if (selectedNotifications.includes(notifId)) {
			selectedNotifications = selectedNotifications.filter((n) => n !== notifId);
		} else {
			selectedNotifications = [...selectedNotifications, notifId];
		}
	}
</script>

<svelte:head>
	<title>Pengaturan Preferensi - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<div class="mx-auto max-w-4xl">
		<main class="space-y-12 py-12">
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

			{#if form?.error}
				<AuthMessage type="error" message={form.error} />
			{/if}

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

							<!-- Invitation-specific welcome message -->
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
							<!-- Invitation Flow: Show selected organization -->
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
							<!-- Regular Flow: Organization selection -->
							<p class={`${TEXT.body} ${COLOR.textSecondary} text-center`}>
								Anda akan membimbing kelompok belajar (batch) melalui materi yang disediakan oleh
								Expert Mentor. Pilih organisasi yang ingin Anda fasilitasi.
							</p>

							<!-- Organization Selection -->
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
				<!-- Student (User) Onboarding - Telemetry/Persona Questions -->
				<div class="space-y-8">
					<div
						class={`${RADIUS.card} border ${COLOR.cardBorder} ${COLOR.card} ${SPACING.cardPadding} space-y-8`}
					>
						<div class="space-y-2">
							<h2 class={`${TEXT.h3} ${COLOR.textPrimary}`}>Bantu Kami Mengenali Anda</h2>
							<p class={TEXT.secondary}>
								Silakan isi preferensi belajar Anda untuk pengalaman yang lebih personal. Semua
								pertanyaan bersifat opsional.
							</p>
						</div>

						<!-- Goals - Multi-domain support -->
						<div class="space-y-4">
							<p class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}>
								Apa tujuan utama Anda? (Pilih semua yang relevan)
							</p>

							<!-- Career Paths Section -->
							<div class="space-y-2">
								<p class="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
									Bidang Karir
								</p>
								<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
									{#each goalOptions.filter((g) => g.domain !== 'general') as goal}
										<button
											type="button"
											class={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${
												selectedGoals.includes(goal.id)
													? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/10 dark:bg-blue-900/20'
													: 'border-zinc-200 hover:border-blue-500/30 dark:border-zinc-700 dark:hover:border-blue-500/30'
											}`}
											onclick={() => toggleGoal(goal.id)}
										>
											<div
												class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600"
											>
												<Icon name={goal.icon} size={18} />
											</div>
											<div class="flex-1">
												<h4 class="text-sm font-semibold">{goal.label}</h4>
											</div>
											{#if selectedGoals.includes(goal.id)}
												<Icon name="check" size={18} class="text-blue-500" />
											{/if}
										</button>
									{/each}
								</div>
							</div>

							<!-- Monetization & Partnership Section -->
							<div class="mt-4 space-y-2">
								<p class="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
									Monetisasi & Kolaborasi
								</p>
								<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
									{#each goalOptions.filter((g) => g.domain === 'general') as goal}
										<button
											type="button"
											class={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${
												selectedGoals.includes(goal.id)
													? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/10 dark:bg-emerald-900/20'
													: 'border-zinc-200 hover:border-emerald-500/30 dark:border-zinc-700 dark:hover:border-emerald-500/30'
											}`}
											onclick={() => toggleGoal(goal.id)}
										>
											<div
												class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600"
											>
												<Icon name={goal.icon} size={18} />
											</div>
											<div class="flex-1">
												<h4 class="text-sm font-semibold">{goal.label}</h4>
											</div>
											{#if selectedGoals.includes(goal.id)}
												<Icon name="check" size={18} class="text-emerald-500" />
											{/if}
										</button>
									{/each}
								</div>
							</div>
						</div>

						<!-- Interests - Multi-domain support -->
						<div class="space-y-4">
							<p class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}>
								Bidang apa yang paling menarik bagi Anda? (Pilih semua yang relevan)
							</p>

							<!-- Developer Interests -->
							<div class="space-y-2">
								<p
									class="flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase"
								>
									<span class="h-2 w-2 rounded-full bg-blue-500"></span> Developer
								</p>
								<div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
									{#each interestOptions.filter((i) => i.domain === 'developer') as interest}
										<button
											type="button"
											class={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all ${
												selectedInterests.includes(interest.id)
													? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/10 dark:bg-blue-900/20'
													: 'border-zinc-200 hover:border-blue-500/30 dark:border-zinc-700 dark:hover:border-blue-500/30'
											}`}
											onclick={() => toggleInterest(interest.id)}
										>
											<Icon name={interest.icon} size={18} />
											<span class="text-xs font-semibold">{interest.label}</span>
											{#if selectedInterests.includes(interest.id)}
												<Icon name="check" size={14} class="absolute top-1 right-1 text-blue-500" />
											{/if}
										</button>
									{/each}
								</div>
							</div>

							<!-- Akademik Interests -->
							<div class="space-y-2">
								<p
									class="flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase"
								>
									<span class="h-2 w-2 rounded-full bg-purple-500"></span> Akademik
								</p>
								<div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
									{#each interestOptions.filter((i) => i.domain === 'akademik') as interest}
										<button
											type="button"
											class={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all ${
												selectedInterests.includes(interest.id)
													? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500/10 dark:bg-purple-900/20'
													: 'border-zinc-200 hover:border-purple-500/30 dark:border-zinc-700 dark:hover:border-purple-500/30'
											}`}
											onclick={() => toggleInterest(interest.id)}
										>
											<Icon name={interest.icon} size={18} />
											<span class="text-xs font-semibold">{interest.label}</span>
											{#if selectedInterests.includes(interest.id)}
												<Icon
													name="check"
													size={14}
													class="absolute top-1 right-1 text-purple-500"
												/>
											{/if}
										</button>
									{/each}
								</div>
							</div>

							<!-- Bisnis & UMKM Interests -->
							<div class="space-y-2">
								<p
									class="flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase"
								>
									<span class="h-2 w-2 rounded-full bg-amber-500"></span> Bisnis & UMKM
								</p>
								<div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
									{#each interestOptions.filter((i) => i.domain === 'bisnis') as interest}
										<button
											type="button"
											class={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all ${
												selectedInterests.includes(interest.id)
													? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/10 dark:bg-amber-900/20'
													: 'border-zinc-200 hover:border-amber-500/30 dark:border-zinc-700 dark:hover:border-amber-500/30'
											}`}
											onclick={() => toggleInterest(interest.id)}
										>
											<Icon name={interest.icon} size={18} />
											<span class="text-xs font-semibold">{interest.label}</span>
											{#if selectedInterests.includes(interest.id)}
												<Icon
													name="check"
													size={14}
													class="absolute top-1 right-1 text-amber-500"
												/>
											{/if}
										</button>
									{/each}
								</div>
							</div>

							<!-- Design & Outdoor Interests (Grid) -->
							<div class="grid grid-cols-2 gap-4">
								<!-- Design -->
								<div class="space-y-2">
									<p
										class="flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase"
									>
										<span class="h-2 w-2 rounded-full bg-pink-500"></span> Design
									</p>
									<div class="grid grid-cols-2 gap-2">
										{#each interestOptions.filter((i) => i.domain === 'design') as interest}
											<button
												type="button"
												class={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all ${
													selectedInterests.includes(interest.id)
														? 'border-pink-500 bg-pink-50 ring-2 ring-pink-500/10 dark:bg-pink-900/20'
														: 'border-zinc-200 hover:border-pink-500/30 dark:border-zinc-700 dark:hover:border-pink-500/30'
												}`}
												onclick={() => toggleInterest(interest.id)}
											>
												<Icon name={interest.icon} size={16} />
												<span class="text-xs">{interest.label}</span>
												{#if selectedInterests.includes(interest.id)}
													<Icon
														name="check"
														size={12}
														class="absolute top-1 right-1 text-pink-500"
													/>
												{/if}
											</button>
										{/each}
									</div>
								</div>

								<!-- Outdoor -->
								<div class="space-y-2">
									<p
										class="flex items-center gap-2 text-xs font-semibold tracking-wider text-zinc-500 uppercase"
									>
										<span class="h-2 w-2 rounded-full bg-teal-500"></span> Outdoor
									</p>
									<div class="grid grid-cols-2 gap-2">
										{#each interestOptions.filter((i) => i.domain === 'outdoor') as interest}
											<button
												type="button"
												class={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all ${
													selectedInterests.includes(interest.id)
														? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500/10 dark:bg-teal-900/20'
														: 'border-zinc-200 hover:border-teal-500/30 dark:border-zinc-700 dark:hover:border-teal-500/30'
												}`}
												onclick={() => toggleInterest(interest.id)}
											>
												<Icon name={interest.icon} size={16} />
												<span class="text-xs">{interest.label}</span>
												{#if selectedInterests.includes(interest.id)}
													<Icon
														name="check"
														size={12}
														class="absolute top-1 right-1 text-teal-500"
													/>
												{/if}
											</button>
										{/each}
									</div>
								</div>
							</div>
						</div>

						<!-- Experience Level -->
						<div class="space-y-4">
							<p class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}>
								Sebutkan tingkat pengalaman Anda secara umum
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
											<Icon name="check" size={16} class="absolute top-2 right-2 text-purple-500" />
										{/if}
									</button>
								{/each}
							</div>
						</div>

						<!-- Learning Schedule -->
						<div class="space-y-4">
							<p class={`${TEXT.small} font-bold ${COLOR.textPrimary}`}>
								Kapan waktu belajar yang ideal untuk Anda?
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
											<Icon name="check" size={16} class="absolute top-2 right-2 text-amber-500" />
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

						<!-- Submit -->
						<form method="POST" action="?/savePreferences" use:enhance>
							<input type="hidden" name="goals" value={JSON.stringify(selectedGoals)} />
							<input type="hidden" name="interests" value={JSON.stringify(selectedInterests)} />
							<input type="hidden" name="experienceLevel" value={experienceLevel} />
							<input type="hidden" name="learningSchedule" value={learningSchedule} />
							<input
								type="hidden"
								name="notificationPrefs"
								value={JSON.stringify(selectedNotifications)}
							/>
							<AuthSubmitButton text="Selesaikan Pengaturan & Masuk" />
						</form>
					</div>
				</div>
			{/if}
		</main>
	</div>
</PageWrapper>

<style>
	:global(.onboarding-container) {
		perspective: 1000px;
	}
</style>
