<script lang="ts">
import { enhance } from '$app/forms';
import type { ActionData } from './$types';
import { onMount, onDestroy } from 'svelte';
import Toast from 'svelte-toast';

let { form }: { form?: ActionData | null } = $props();

	let mouseX = $state(0);
	let mouseY = $state(0);
	let mounted = $state(false);

	// Initialize toast instance
	const toast = new Toast({
		position: 'bottom-right',
		duration: 5000
	});

	// Rotating professions for animated text
	const professions = [
		'Web Developer',
		'Network Engineer',
		'Digital Creator',
		'Content Creator',
		'Copywriter',
		'Sysadmin',
		'IT Support',
		'Pentester',
		'Bug Hunter',
		'DevOps Engineer',
		'UI/UX Designer',
		'Data Analyst',
		'Cloud Engineer',
		'Mobile Developer',
		'Backend Engineer',
		'Frontend Engineer',
		'IoT Developer'
	];

	// Color palette untuk gradient random - warna lebih gelap untuk kontras lebih baik
	const gradientColors = [
		['#667eea', '#764ba2', '#5a4fcf'], // Purple classic (darker)
		['#5b6de8', '#6a4c93'], // Purple duo (darker)
		['#c471ed', '#f64f59'], // Pink to red (darker)
		['#3d8bfd', '#0099cc'], // Blue to cyan (darker)
		['#2dd4bf', '#14b8a6'], // Teal shades (darker)
		['#d946ef', '#ec4899'], // Pink purple (darker)
		['#06b6d4', '#3b82f6'], // Cyan to blue (darker)
		['#8b5cf6', '#a855f7'], // Purple shades (darker)
		['#ef4444', '#f97316'], // Red to orange (darker)
		['#10b981', '#059669'], // Green shades (darker)
		['#3b82f6', '#2563eb'], // Blue shades (darker)
		['#ec4899', '#db2777'], // Pink shades (darker)
		['#14b8a6', '#0d9488'], // Teal (darker)
		['#8b5cf6', '#7c3aed'], // Purple (darker)
		['#6366f1', '#4f46e5'], // Indigo (darker)
		['#f59e0b', '#d97706'], // Amber (darker)
		['#e11d48', '#be123c'] // Rose red (darker)
	];

	let currentProfessionIndex = $state(0);
	let displayedText = $state('');
	let isDeleting = $state(false);
	let typingSpeed = $state(100);
	let currentGradient = $state(gradientColors[0]);
	let gradientIndex = $state(0);
	let animationTimeout: ReturnType<typeof setTimeout> | null = null;
	// Reserve width to prevent layout shift - set initial width to prevent truncation
	let maxProfessionWidthPx = $state(250);

	// Multi-step form state
	let currentStep = $state(1);
	const totalSteps = 3;

const INITIAL_FORM_VALUES = {
	fullName: '',
	phone: '',
	interest: '',
	email: '',
	school: '',
	enrollmentYear: '',
	educationStatus: '',
	screenshot: '',
	instagramUsername: ''
};

function getInitialFieldValue<Key extends keyof typeof INITIAL_FORM_VALUES>(key: Key): string {
	const actionData = form as ({ data?: Partial<typeof INITIAL_FORM_VALUES> } | null | undefined);
	const value = actionData?.data?.[key];
	return typeof value === 'string' ? value : INITIAL_FORM_VALUES[key];
}

// Form data state - menyimpan nilai input antar langkah
let formData = $state({
	fullName: getInitialFieldValue('fullName'),
	phone: getInitialFieldValue('phone'),
	interest: getInitialFieldValue('interest'),
	email: getInitialFieldValue('email'),
	school: getInitialFieldValue('school'),
	enrollmentYear: getInitialFieldValue('enrollmentYear'),
	educationStatus: getInitialFieldValue('educationStatus'),
	screenshot: getInitialFieldValue('screenshot'),
	instagramUsername: getInitialFieldValue('instagramUsername')
});

	// File upload state
	let screenshotFile = $state<File | null>(null);
	let screenshotPreview = $state<string | null>(null);

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			screenshotFile = file;
			// Create preview
			const reader = new FileReader();
			reader.onload = (e) => {
				screenshotPreview = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function goNextStep() {
		if (currentStep < totalSteps) currentStep += 1;
	}

	function goPrevStep() {
		if (currentStep > 1) currentStep -= 1;
	}

	function computeMaxProfessionWidth() {
		const titleEl = document.querySelector('.title') as HTMLElement | null;
		if (!titleEl) return;
		const style = getComputedStyle(titleEl);
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		// Use title font for accurate width
		ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
		let max = 0;
		for (const p of professions) {
			const w = ctx.measureText(p).width;
			if (w > max) max = w;
		}
		// Add small buffer for cursor and subpixel
		maxProfessionWidthPx = Math.ceil(max + 16);
	}

	function clearAnimation() {
		if (animationTimeout) {
			clearTimeout(animationTimeout);
			animationTimeout = null;
		}
	}

	function getRandomGradient() {
		// Get different gradient each time, ensuring variety
		let newIndex = gradientIndex;
		// If this is first call (gradientIndex is 0 and hasn't changed), allow same index
		if (gradientColors.length === 1) {
			return gradientColors[0];
		}
		while (newIndex === gradientIndex && gradientColors.length > 1) {
			newIndex = Math.floor(Math.random() * gradientColors.length);
		}
		gradientIndex = newIndex;
		return gradientColors[gradientIndex];
	}

	function startTypingAnimation() {
		if (!mounted) return;

		// Clear any existing timeout
		clearAnimation();

		const currentText = professions[currentProfessionIndex];

		if (isDeleting) {
			// Deleting characters - faster like terminal backspace
			if (displayedText.length > 0) {
				displayedText = displayedText.substring(0, displayedText.length - 1);
				animationTimeout = setTimeout(startTypingAnimation, 40);
			} else {
				// Finished deleting, move to next profession
				isDeleting = false;
				currentProfessionIndex = (currentProfessionIndex + 1) % professions.length;
				// Change gradient for new profession
				currentGradient = getRandomGradient();
				typingSpeed = 80; // Consistent typing speed like terminal
				animationTimeout = setTimeout(startTypingAnimation, 300);
			}
		} else {
			// Typing characters - consistent mechanical speed
			const targetText = professions[currentProfessionIndex];
			if (displayedText.length < targetText.length) {
				displayedText = targetText.substring(0, displayedText.length + 1);
				// Slight random variation (80-120ms) for natural feel but still terminal-like
				const variation = Math.floor(Math.random() * 40) + 80;
				animationTimeout = setTimeout(startTypingAnimation, variation);
			} else {
				// Finished typing, pause before deleting
				typingSpeed = 1500;
				isDeleting = true;
				animationTimeout = setTimeout(startTypingAnimation, typingSpeed);
			}
		}
	}

	onMount(() => {
		mounted = true;
		// Initialize with first profession and random gradient
		currentGradient = getRandomGradient();
		// Measure once and on resize to prevent layout shift
		computeMaxProfessionWidth();
		const onResize = () => computeMaxProfessionWidth();
		window.addEventListener('resize', onResize);
		// Start animation immediately but with first character
		startTypingAnimation();
		onDestroy(() => window.removeEventListener('resize', onResize));

		// Show toast notifications after mount (client-side only)
	if (form?.error) {
		toast.error(form.error);
	}
	if (form?.success) {
		toast.success(
			form?.message ?? 'Berhasil mendaftar! Terima kasih atas pendaftaran Anda.'
		);
	}
	});

	onDestroy(() => {
		// Cleanup animation timeout on unmount
		clearAnimation();
	});

	function handleMouseMove(event: MouseEvent) {
		mouseX = event.clientX;
		mouseY = event.clientY;
	}
</script>

<svelte:head>
	<title>Join Waiting List - Naik Kelas</title>
</svelte:head>

<div class="waiting-list-page" onmousemove={handleMouseMove} role="presentation">
	<!-- Animated Background Elements -->
	<div class="bg-gradient"></div>
	<div class="bg-blobs">
		<div class="blob blob-1"></div>
		<div class="blob blob-2"></div>
		<div class="blob blob-3"></div>
	</div>

	<!-- Back to Home Button (Desktop/Tablet) -->
	<a href="/" class="back-button" aria-label="Kembali ke Home">
		<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M12.5 15L7.5 10L12.5 5"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</a>

	<!-- Toaster for notifications -->
	<div id="toast-container"></div>

	<!-- Mobile Header -->
	<div class="mobile-header">
		<a href="/" class="back-button-mobile" aria-label="Kembali ke Home">
			<svg
				width="20"
				height="20"
				viewBox="0 0 20 20"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M12.5 15L7.5 10L12.5 5"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</a>
		<div class="badge badge-mobile" class:fade-in={mounted}>✨ Join Waiting List</div>
	</div>

	<!-- Main Content -->
	<div class="content-wrapper">
		<!-- Header Section -->
		<div class="header-section">
			<div class="badge badge-desktop" class:fade-in={mounted}>✨ Join Waiting List</div>
			<h1 class="title" class:fade-in={mounted} style="--delay: 0.1s">
				Mulai Perjalananmu
				<span class="rotating-profession">
					Jadi,{' '}
					<span class="profession-box" style="width: {maxProfessionWidthPx}px">
						{#if displayedText}
							<span
								class="profession-text"
								style="--gradient-start: {currentGradient[0]}; --gradient-mid: {currentGradient[1] ||
									currentGradient[0]}; --gradient-end: {currentGradient[2] ||
									currentGradient[1] ||
									currentGradient[0]};"
							>
								{displayedText}
							</span>
						{/if}
						<span
							class="typing-cursor"
							class:hidden={!displayedText}
							style="--cursor-color: {displayedText ? currentGradient[0] : 'transparent'};"
						></span>
						{#if !displayedText && !isDeleting}
							<!-- Saat belum mulai typing, tampilkan placeholder -->
							<span class="profession-text placeholder">?</span>
						{/if}
					</span>
				</span>
			</h1>
			<p class="subtitle" class:fade-in={mounted} style="--delay: 0.2s">
				Dapatkan update pembukaan batch dan penawaran khusus untuk kamu yang ingin memulai
				perjalanan belajar jadi profesional di bidang teknologi!
			</p>
		</div>

		<!-- Form Card -->
		<div class="form-card" class:fade-in={mounted} style="--delay: 0.3s">
			{#if form?.success}
				<div class="success-screen">
					<div class="success-icon">
						<svg width="80" height="80" viewBox="0 0 80 80" fill="none">
							<circle cx="40" cy="40" r="35" fill="url(#successGradient)" />
							<path
								d="M25 40L35 50L55 30"
								stroke="white"
								stroke-width="5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<defs>
								<linearGradient id="successGradient" x1="0" y1="0" x2="80" y2="80">
									<stop offset="0%" stop-color="#667eea" />
									<stop offset="100%" stop-color="#764ba2" />
								</linearGradient>
							</defs>
						</svg>
					</div>
					<h2>Terima Kasih! 🎉</h2>
					<p>
						{form?.message ??
							'Kamu telah berhasil mendaftar di waiting list. Kami akan menghubungi kamu segera setelah batch dibuka.'}
					</p>
					<a href="/" class="home-link">Kembali ke Beranda</a>
				</div>
			{:else}
				<form
					method="POST"
					action="?/join"
					class="waiting-list-form"
					use:enhance
					enctype="multipart/form-data"
				>
					<!-- Hidden inputs to preserve all form data across steps -->
					{#if currentStep !== 1}
						<input type="hidden" name="fullName" value={formData.fullName} />
					{/if}
					{#if currentStep !== 1}
						<input type="hidden" name="phone" value={formData.phone} />
					{/if}
					{#if currentStep !== 1}
						<input type="hidden" name="interest" value={formData.interest} />
					{/if}
					{#if currentStep !== 2}
						<input type="hidden" name="email" value={formData.email} />
					{/if}
					{#if currentStep !== 2}
						<input type="hidden" name="school" value={formData.school} />
					{/if}
					{#if currentStep !== 2}
						<input type="hidden" name="enrollmentYear" value={formData.enrollmentYear} />
					{/if}
					{#if currentStep !== 2}
						<input type="hidden" name="educationStatus" value={formData.educationStatus} />
					{/if}
					{#if currentStep !== 3}
						<input type="hidden" name="instagramUsername" value={formData.instagramUsername} />
					{/if}

					<div class="progress">
						<div class="progress-track">
							<div
								class="progress-bar"
								style="width: {Math.round((currentStep / totalSteps) * 100)}%"
							></div>
						</div>
						<div class="progress-text">Langkah {currentStep} dari {totalSteps}</div>
					</div>
					{#if currentStep === 1}
						<!-- Name Field -->
						<div class="form-field">
							<label for="fullName">
								<span>Nama Lengkap</span>
								<span class="required">*</span>
							</label>
							<div class="input-wrapper">
								<svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
									<path
										d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z"
										fill="currentColor"
									/>
									<path
										d="M10 12C5.58172 12 2 13.7909 2 16V20H18V16C18 13.7909 14.4183 12 10 12Z"
										fill="currentColor"
									/>
								</svg>
								<input
									type="text"
									id="fullName"
									name="fullName"
									placeholder="Masukkan nama lengkap kamu"
									required
									minlength="2"
									autocomplete="name"
									bind:value={formData.fullName}
								/>
							</div>
						</div>

						<!-- Phone Field -->
						<div class="form-field">
							<label for="phone">
								<span>No. HP</span>
								<span class="optional">(Whatsapp)</span>
							</label>
							<div class="input-wrapper">
								<svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
									<path
										d="M17.5 14.1667V16.6667C17.5 17.5871 16.7538 18.3333 15.8333 18.3333C7.16305 18.3333 0 11.1703 0 2.5C0 1.57953 0.746192 0.833336 1.66667 0.833336H4.16667C5.08714 0.833336 5.83333 1.57953 5.83333 2.5V4.43752C5.83333 5.35799 5.29976 6.17249 4.4428 6.51664L3.03803 7.10405C2.58587 7.28715 2.31861 7.73777 2.41216 8.21305C2.92979 10.6307 4.36927 12.0702 6.78695 12.5878C7.26223 12.6814 7.71285 12.4141 7.89595 11.962L8.48336 10.5572C8.82751 9.70024 9.64201 9.16667 10.5625 9.16667H12.5C13.4205 9.16667 14.1667 9.91286 14.1667 10.8333Z"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
								<input
									type="tel"
									id="phone"
									name="phone"
									placeholder="081234567890"
									autocomplete="tel"
									bind:value={formData.phone}
								/>
							</div>
						</div>

						<!-- Interest Field -->
						<div class="form-field">
							<label for="interest">
								<span>Minat</span>
								<span class="optional">(Opsional)</span>
							</label>
							<div class="select-wrapper">
								<svg class="select-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
									<path
										d="M3.33333 7.5L10 12.5L16.6667 7.5"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
								<select
									id="interest"
									name="interest"
									class="select-field"
									bind:value={formData.interest}
								>
									<option value="">Pilih minat kamu</option>
									<optgroup label="Development">
										<option value="python">🐍 Python Programming</option>
										<option value="web">🌐 Web Development</option>
										<option value="frontend">🎨 Frontend Development</option>
										<option value="backend">⚙️ Backend Development</option>
										<option value="fullstack">🚀 Full Stack Development</option>
										<option value="mobile">📱 Mobile Development</option>
										<option value="devops">☁️ DevOps & Cloud</option>
										<option value="career-switch">💼 Career Switch ke Tech</option>
										<option value="upskill">📈 Upskill Development Skills</option>
									</optgroup>
									<optgroup label="Digital Media & Content">
										<option value="digital-creator">✨ Digital Media Creator</option>
										<option value="content-creator">📝 Content Creator</option>
										<option value="copywriter">✍️ Copywriter</option>
										<option value="social-media">📱 Social Media Management</option>
										<option value="video-editing">🎬 Video Editing & Production</option>
										<option value="graphic-design">🎨 Graphic Design</option>
									</optgroup>
									<optgroup label="Cybersecurity & Hacking">
										<option value="pentester">🔒 Pentester (Ethical Hacking)</option>
										<option value="bug-hunter">🐛 Bug Hunter</option>
										<option value="cybersecurity">🛡️ Cybersecurity</option>
										<option value="network-security">🌐 Network Security</option>
									</optgroup>
									<optgroup label="Business & Entrepreneurship">
										<option value="business">💼 Business & Entrepreneurship</option>
										<option value="digital-marketing">📊 Digital Marketing</option>
										<option value="e-commerce">🛒 E-commerce</option>
										<option value="startup">🚀 Startup & Innovation</option>
									</optgroup>
									<optgroup label="IT Support & Infrastructure">
										<option value="it-support">🖥️ IT Support</option>
										<option value="sysadmin">⚙️ System Administration</option>
										<option value="network-engineer">🌐 Network Engineer</option>
										<option value="data-analyst">📊 Data Analyst</option>
									</optgroup>
									<optgroup label="Psychology & Behavior">
										<option value="psychology">🧠 Psikologi</option>
										<option value="industrial-psychology">💼 Psikologi Industri & Organisasi</option
										>
										<option value="clinical-psychology">🏥 Psikologi Klinis</option>
										<option value="consumer-psychology">🛍️ Consumer Psychology</option>
										<option value="behavioral-analysis">🔍 Behavioral Analysis</option>
									</optgroup>
								</select>
							</div>
						</div>
						<div class="step-actions">
							<button type="button" class="secondary-button" onclick={goNextStep}>Lanjut</button>
						</div>
					{/if}

					{#if currentStep === 2}
						<!-- Email Field -->
						<div class="form-field">
							<label for="email">
								<span>Email</span>
								<span class="required">*</span>
							</label>
							<div class="input-wrapper">
								<svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
									<path
										d="M2.5 6.66667L9.0755 11.0504C9.63533 11.4236 10.3647 11.4236 10.9245 11.0504L17.5 6.66667M4.16667 15.8333H15.8333C16.7538 15.8333 17.5 15.0871 17.5 14.1667V5.83333C17.5 4.91286 16.7538 4.16667 15.8333 4.16667H4.16667C3.24619 4.16667 2.5 4.91286 2.5 5.83333V14.1667C2.5 15.0871 3.24619 15.8333 4.16667 15.8333Z"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
								<input
									type="email"
									id="email"
									name="email"
									placeholder="email@example.com atau nama@belajar.id"
									required
									autocomplete="email"
									bind:value={formData.email}
								/>
							</div>
							<p class="field-hint">Email belajar.id dapat digunakan (contoh: nama@belajar.id)</p>
						</div>

						<!-- School/University Field -->
						<div class="form-field">
							<label for="school">
								<span>Asal Sekolah/Universitas</span>
								<span class="optional">(Opsional)</span>
							</label>
							<div class="input-wrapper">
								<svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
									<path
										d="M10 2L2 7L10 12L18 7L10 2Z"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M2 17L10 22L18 17"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M2 12L10 17L18 12"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
								<input
									type="text"
									id="school"
									name="school"
									placeholder="Nama sekolah atau universitas"
									autocomplete="organization"
									bind:value={formData.school}
								/>
							</div>
						</div>

						<!-- Enrollment Year & Education Status - Row Layout on Mobile -->
						<div class="form-row-mobile">
							<!-- Enrollment Year Field -->
							<div class="form-field">
								<label for="enrollmentYear">
									<span>Tahun Masuk</span>
									<span class="optional">(Opsional)</span>
								</label>
								<div class="input-wrapper">
									<svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
										<path
											d="M15 2V6M5 2V6M2.5 9.09V17C2.5 17.5523 2.94772 18 3.5 18H16.5C17.0523 18 17.5 17.5523 17.5 17V9.09M2.5 9.09C2.5 8.53772 2.94772 8.09 3.5 8.09H16.5C17.0523 8.09 17.5 8.53772 17.5 9.09M2.5 9.09H17.5M12.5 13H17.5M12.5 15H17.5"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
									<input
										type="number"
										id="enrollmentYear"
										name="enrollmentYear"
										placeholder="Contoh: 2020"
										min="1950"
										max="2030"
										pattern="[0-9]{4}"
										bind:value={formData.enrollmentYear}
									/>
								</div>
							</div>

							<!-- Education Status Field -->
							<div class="form-field">
								<label for="educationStatus">
									<span>Status Pendidikan</span>
									<span class="optional">(Opsional)</span>
								</label>
								<div class="select-wrapper">
									<svg class="select-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
										<path
											d="M3.33333 7.5L10 12.5L16.6667 7.5"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
									<select
										id="educationStatus"
										name="educationStatus"
										class="select-field"
										bind:value={formData.educationStatus}
									>
										<option value="">Pilih status pendidikan</option>
										<option value="lulus">✅ Lulus</option>
										<option value="tidak-lulus">❌ Tidak Lulus</option>
										<option value="aktif">🟢 Aktif (Masih Pendidikan)</option>
										<option value="nonaktif">🔴 Nonaktif (Putus/Tidak Aktif)</option>
									</select>
								</div>
							</div>
						</div>

						<div class="step-actions">
							<button type="button" class="secondary-button" onclick={goPrevStep}>Kembali</button>
							<button type="button" class="secondary-button" onclick={goNextStep}>Lanjut</button>
						</div>
					{/if}

					{#if currentStep === 3}
						<!-- Instagram Username Field -->
						<div class="form-field">
							<label for="instagramUsername">
								<span>Username Instagram</span>
								<span class="required">*</span>
							</label>
							<div class="input-wrapper">
								<svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
									<path
										d="M14.1667 2.5H5.83333C4.91286 2.5 4.16667 3.24619 4.16667 4.16667V14.1667C4.16667 15.0871 4.91286 15.8333 5.83333 15.8333H14.1667C15.0871 15.8333 15.8333 15.0871 15.8333 14.1667V4.16667C15.8333 3.24619 15.0871 2.5 14.1667 2.5Z"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M14.5833 5.83333H14.5917"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
								<input
									type="text"
									id="instagramUsername"
									name="instagramUsername"
									placeholder="@username (tanpa @)"
									required
									bind:value={formData.instagramUsername}
								/>
							</div>
							<p class="field-hint">
								Masukkan username Instagram kamu untuk verifikasi (contoh: koneksi.belajar)
							</p>
						</div>

						<!-- Screenshot Proof Field -->
						<div class="form-field">
							<label for="screenshot">
								<span>Bukti Screenshot</span>
								<span class="required">*</span>
							</label>
							<div class="file-upload-wrapper">
								<label for="screenshot" class="file-upload-label">
									<svg
										class="file-upload-icon"
										width="24"
										height="24"
										viewBox="0 0 20 20"
										fill="none"
									>
										<path
											d="M6.66667 13.3333L10 10M10 10L13.3333 13.3333M10 10V17.5M16.6667 14.1667C17.5871 14.1667 18.3333 13.4205 18.3333 12.5V5.83333C18.3333 4.91286 17.5871 4.16667 16.6667 4.16667H12.5L10.8333 2.5H5.83333C4.91286 2.5 4.16667 3.24619 4.16667 4.16667V12.5C4.16667 13.4205 4.91286 14.1667 5.83333 14.1667H16.6667Z"
											stroke="currentColor"
											stroke-width="1.5"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
									<span class="file-upload-text">
										{#if screenshotFile}
											{screenshotFile.name}
										{:else}
											Pilih gambar screenshot
										{/if}
									</span>
									<input
										type="file"
										id="screenshot"
										name="screenshot"
										accept="image/*"
										required
										onchange={handleFileChange}
									/>
								</label>
								{#if screenshotPreview}
									<div class="screenshot-preview">
										<img src={screenshotPreview} alt="Screenshot preview" />
										<button
											type="button"
											class="remove-image"
											onclick={() => {
												screenshotFile = null;
												screenshotPreview = null;
											}}
										>
											×
										</button>
									</div>
								{/if}
							</div>
							<p class="field-hint">
								Silakan screenshot bukti kamu sudah follow Instagram
								<a
									href="https://instagram.com/koneksi.belajar"
									target="_blank"
									rel="noopener noreferrer"
									class="instagram-link"
								>
									@koneksi.belajar
								</a>
								, lalu upload screenshot-nya di sini
							</p>
						</div>

						<input type="hidden" name="source" value="landing-cta" />

						<div class="step-actions">
							<button type="button" class="secondary-button" onclick={goPrevStep}>Kembali</button>
							<button type="submit" class="submit-button">
								<span>Gabung Waiting List</span>
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
									<path
										d="M4 10H16M16 10L12 6M16 10L12 14"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</button>
						</div>
					{/if}
				</form>

				<!-- Sign In Link -->
				<div class="signin-link">
					<p>
						Sudah punya akun?
						<a href="/auth/signin">Masuk di sini</a>
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.waiting-list-page {
		min-height: 100vh;
		position: relative;
		overflow-x: hidden;
		padding: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Animated Background Gradient */
	.bg-gradient {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			135deg,
			var(--color-bg-hero) 0%,
			var(--color-bg-hero-end) 50%,
			oklch(94% 0.01 280) 100%
		);
		z-index: 0;
	}

	/* Floating Blobs Animation */
	.bg-blobs {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 1;
		overflow: hidden;
		pointer-events: none;
	}

	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(60px);
		opacity: 0.4;
		animation: float 20s infinite ease-in-out;
	}

	.blob-1 {
		width: 400px;
		height: 400px;
		background: var(--color-gradient-purple-start);
		top: -100px;
		left: -100px;
		animation-delay: 0s;
	}

	.blob-2 {
		width: 300px;
		height: 300px;
		background: var(--color-gradient-purple-mid);
		bottom: -50px;
		right: -50px;
		animation-delay: 5s;
	}

	.blob-3 {
		width: 350px;
		height: 350px;
		background: var(--color-gradient-purple-end);
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		animation-delay: 10s;
	}

	@keyframes float {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		33% {
			transform: translate(30px, -30px) scale(1.1);
		}
		66% {
			transform: translate(-20px, 20px) scale(0.9);
		}
	}

	/* Mobile Header - Background untuk tombol kembali dan badge */
	.mobile-header {
		display: none;
	}

	.badge-mobile {
		display: none;
	}

	.badge-desktop {
		display: inline-flex;
	}

	/* Back Button - Glassmorphism yang selaras dengan form */
	.back-button {
		position: fixed;
		bottom: 24px;
		left: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		width: 44px;
		height: 44px;
		padding: 0;
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(40px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.4);
		border-radius: 12px;
		text-decoration: none;
		color: var(--color-primary-dark);
		font-weight: 600;
		box-shadow:
			0 4px 16px rgba(0, 0, 0, 0.1),
			0 2px 8px rgba(102, 126, 234, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 1000;
	}

	.back-button:hover {
		transform: translateY(-2px);
		background: rgba(255, 255, 255, 0.95);
		box-shadow:
			0 8px 24px rgba(0, 0, 0, 0.15),
			0 4px 12px rgba(102, 126, 234, 0.12),
			inset 0 1px 0 rgba(255, 255, 255, 0.95);
		border-color: rgba(102, 126, 234, 0.3);
	}

	.back-button svg {
		color: var(--color-primary-dark);
		transition: transform 0.3s ease;
		width: 20px;
		height: 20px;
	}

	.back-button:hover svg {
		transform: translateX(-2px);
	}

	/* Content Wrapper */
	.content-wrapper {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
		padding: 20px 0;
		display: flex;
		flex-direction: column;
		gap: 32px;
		align-items: stretch;
	}

	/* Header Section */
	.header-section {
		text-align: center;
		margin-bottom: 0;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 6px 16px;
		background: rgba(255, 255, 255, 0.7);
		backdrop-filter: blur(20px) saturate(180%);
		border: 1px solid rgba(102, 126, 234, 0.2);
		border-radius: 50px;
		color: var(--color-gradient-purple-start);
		font-weight: 600;
		font-size: 0.85em;
		margin-bottom: 16px;
		box-shadow: 0 4px 16px rgba(102, 126, 234, 0.1);
		opacity: 0;
		transform: translateY(10px);
		transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.badge.fade-in {
		opacity: 1;
		transform: translateY(0);
		transition-delay: var(--delay, 0s);
	}

	.title {
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 700;
		color: var(--color-primary-dark);
		margin-bottom: 12px;
		line-height: 1.2;
		opacity: 0;
		transform: translateY(10px);
		transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.title.fade-in {
		opacity: 1;
		transform: translateY(0);
		transition-delay: var(--delay, 0s);
	}

	.rotating-profession {
		display: inline-block;
		position: relative;
	}

	.profession-box {
		display: inline-flex;
		align-items: baseline;
		white-space: nowrap;
	}

	.profession-text {
		display: inline-block;
		min-width: fit-content;
		text-align: left;
		background: linear-gradient(
			135deg,
			var(--gradient-start) 0%,
			var(--gradient-mid) 50%,
			var(--gradient-end) 100%
		);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		background-size: 200% 200%;
		animation:
			pulseGradient 3s ease-in-out infinite,
			colorShift 4s ease-in-out infinite;
		font-weight: 700;
	}

	.profession-text.placeholder {
		color: var(--color-primary-medium);
		background: none;
		-webkit-text-fill-color: var(--color-primary-medium);
		animation: none;
		opacity: 0.6;
	}

	@keyframes pulseGradient {
		0%,
		100% {
			filter: brightness(1);
			transform: scale(1);
		}
		50% {
			filter: brightness(1.2);
			transform: scale(1.02);
		}
	}

	@keyframes colorShift {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.typing-cursor {
		display: inline-block;
		width: 0.2em;
		height: 1em;
		background: var(--cursor-color);
		vertical-align: middle;
		animation: terminalBlink 1s step-end infinite;
		font-family: 'Courier New', 'Consolas', monospace;
	}

	.typing-cursor.hidden {
		display: none;
	}

	@keyframes terminalBlink {
		0%,
		49% {
			opacity: 1;
		}
		50%,
		100% {
			opacity: 0;
		}
	}

	.subtitle {
		font-size: clamp(0.95rem, 2vw, 1.1rem);
		color: var(--color-primary-medium);
		line-height: 1.5;
		max-width: 500px;
		margin: 0 auto;
		opacity: 0;
		transform: translateY(10px);
		transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
	}

	/* Desktop Side-by-Side Layout - Optimized for 100vh */
	@media (min-width: 1024px) {
		.waiting-list-page {
			padding: 16px;
			height: 100vh;
			overflow-y: auto;
			align-items: center;
		}

		.content-wrapper {
			max-width: 1200px;
			flex-direction: row;
			align-items: center;
			gap: 48px;
			padding: 20px 0;
			margin: auto 0;
		}

		.header-section {
			text-align: left;
			flex: 0 0 480px;
			max-width: 480px;
			padding-right: 16px;
		}

		.badge {
			margin-left: 0;
			margin-right: auto;
			margin-bottom: 12px;
		}

		.title {
			margin-bottom: 10px;
		}

		.subtitle {
			max-width: 100%;
			margin: 0;
		}

		.form-card {
			flex: 1;
			max-width: 480px;
			margin-left: auto;
			padding: 20px;
		}

		.waiting-list-form {
			gap: 12px;
		}
	}

	/* Large Desktop - More Spacing but still compact */
	@media (min-width: 1280px) {
		.content-wrapper {
			max-width: 1320px;
			gap: 56px;
			padding: 24px;
		}

		.header-section {
			flex: 0 0 520px;
			max-width: 520px;
		}

		.form-card {
			max-width: 560px;
			padding: 28px;
		}
	}

	.subtitle.fade-in {
		opacity: 1;
		transform: translateY(0);
		transition-delay: var(--delay, 0s);
	}

	/* Form Card - Glassmorphism (Ultra Compact) */
	.form-card {
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(40px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.4);
		border-radius: 16px;
		padding: 20px;
		box-shadow:
			0 20px 60px rgba(0, 0, 0, 0.1),
			0 8px 32px rgba(102, 126, 234, 0.08),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		opacity: 0;
		transform: translateY(20px);
		transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.form-card.fade-in {
		opacity: 1;
		transform: translateY(0);
		transition-delay: var(--delay, 0s);
	}

	/* Success Screen */
	.success-screen {
		text-align: center;
		padding: 20px 0;
	}

	.success-icon {
		margin-bottom: 24px;
		animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}

	.success-screen h2 {
		font-size: 2em;
		color: var(--color-primary-dark);
		margin-bottom: 12px;
	}

	.success-screen p {
		color: var(--color-primary-medium);
		line-height: 1.6;
		margin-bottom: 32px;
	}

	.home-link {
		display: inline-block;
		padding: 12px 32px;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 100%
		);
		color: white;
		text-decoration: none;
		border-radius: 12px;
		font-weight: 600;
		transition: all 0.3s ease;
		box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
	}

	.home-link:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
	}

	@keyframes bounceIn {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Form Styles - Ultra Compact */
	.waiting-list-form {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.progress {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 6px;
	}

	.progress-track {
		flex: 1;
		height: 6px;
		background: rgba(0, 0, 0, 0.06);
		border-radius: 999px;
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(
			90deg,
			var(--color-gradient-purple-start),
			var(--color-gradient-purple-end)
		);
		transition: width 0.3s ease;
	}

	.progress-text {
		font-size: 0.8em;
		color: var(--color-primary-medium);
		min-width: 120px;
		text-align: right;
	}

	.step-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		margin-top: 6px;
	}

	.secondary-button {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 1;
		gap: 8px;
		padding: 10px 16px;
		border-radius: 10px;
		border: 1px solid rgba(0, 0, 0, 0.08);
		background: rgba(255, 255, 255, 0.7);
		color: var(--color-primary-dark);
		font-weight: 600;
		transition: all 0.2s ease;
	}

	.secondary-button:hover {
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
	}

	.step-actions .submit-button {
		flex: 1;
	}

	.form-field {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.form-row-mobile {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.form-field label {
		display: flex;
		align-items: center;
		gap: 4px;
		font-weight: 600;
		color: var(--color-primary-dark);
		font-size: 0.8em;
		line-height: 1.2;
	}

	.required {
		color: #ef4444;
	}

	.optional {
		font-weight: 400;
		color: var(--color-primary-medium);
		font-size: 0.75em;
	}

	.field-hint {
		margin-top: 4px;
		font-size: 0.75em;
		color: var(--color-primary-medium);
		line-height: 1.4;
	}

	.instagram-link {
		color: var(--color-gradient-purple-start);
		text-decoration: none;
		font-weight: 600;
		transition: color 0.2s ease;
	}

	.instagram-link:hover {
		color: var(--color-gradient-purple-end);
		text-decoration: underline;
	}

	.file-upload-wrapper {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.file-upload-label {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		padding: 12px 16px;
		border: 2px dashed rgba(102, 126, 234, 0.3);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.7);
		backdrop-filter: blur(10px);
		cursor: pointer;
		transition: all 0.3s ease;
		color: var(--color-primary-dark);
		font-weight: 500;
	}

	.file-upload-label:hover {
		border-color: var(--color-gradient-purple-start);
		background: rgba(255, 255, 255, 0.9);
		transform: translateY(-1px);
	}

	.file-upload-label input[type='file'] {
		display: none;
	}

	.file-upload-icon {
		color: var(--color-gradient-purple-start);
		flex-shrink: 0;
	}

	.file-upload-text {
		color: var(--color-primary-dark);
		font-size: 0.9em;
	}

	.screenshot-preview {
		position: relative;
		width: 100%;
		border-radius: 8px;
		overflow: hidden;
		border: 2px solid rgba(102, 126, 234, 0.2);
	}

	.screenshot-preview img {
		width: 100%;
		height: auto;
		display: block;
		max-height: 300px;
		object-fit: contain;
		background: rgba(0, 0, 0, 0.02);
	}

	.remove-image {
		position: absolute;
		top: 8px;
		right: 8px;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: rgba(239, 68, 68, 0.9);
		color: white;
		border: none;
		font-size: 20px;
		font-weight: bold;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.remove-image:hover {
		background: rgba(239, 68, 68, 1);
		transform: scale(1.1);
	}

	.input-wrapper,
	.select-wrapper {
		position: relative;
	}

	.input-icon,
	.select-icon {
		position: absolute;
		left: 12px;
		top: 50%;
		transform: translateY(-50%);
		color: var(--color-primary-medium);
		pointer-events: none;
		z-index: 1;
		width: 16px;
		height: 16px;
	}

	.form-field input,
	.select-field {
		width: 100%;
		padding: 10px 12px 10px 38px;
		border: 2px solid rgba(229, 231, 235, 0.8);
		border-radius: 8px;
		font-size: 0.9em;
		font-family: inherit;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		color: var(--color-primary-dark);
		line-height: 1.4;
	}

	.form-field input:focus,
	.select-field:focus {
		outline: none;
		border-color: var(--color-gradient-purple-start);
		box-shadow:
			0 0 0 4px rgba(102, 126, 234, 0.1),
			0 4px 16px rgba(102, 126, 234, 0.15);
		background: rgba(255, 255, 255, 1);
		transform: translateY(-1px);
	}

	.select-field {
		appearance: none;
		cursor: pointer;
		padding-right: 48px;
	}

	.select-wrapper .select-icon {
		right: 12px;
		left: auto;
		width: 14px;
		height: 14px;
		transition: transform 0.3s ease;
	}

	.select-wrapper:focus-within .select-icon {
		transform: translateY(-50%) rotate(180deg);
	}

	/* Submit Button - Ultra Compact */
	.submit-button {
		margin-top: 4px;
		padding: 11px 24px;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 50%,
			var(--color-gradient-purple-end) 100%
		);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 0.95em;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
		position: relative;
		overflow: hidden;
		line-height: 1.4;
	}

	.submit-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
		transition: left 0.5s ease;
	}

	.submit-button:hover::before {
		left: 100%;
	}

	.submit-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
	}

	.submit-button:active:not(:disabled) {
		transform: translateY(0);
	}

	.submit-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.submit-button svg {
		transition: transform 0.3s ease;
	}

	.submit-button:hover:not(:disabled) svg {
		transform: translateX(4px);
	}

	/* Sign In Link - Ultra Compact */
	.signin-link {
		margin-top: 12px;
		text-align: center;
		padding-top: 12px;
		border-top: 1px solid rgba(229, 231, 235, 0.5);
	}

	.signin-link p {
		color: var(--color-primary-medium);
		font-size: 0.85em;
	}

	.signin-link a {
		color: var(--color-gradient-purple-start);
		text-decoration: none;
		font-weight: 600;
		transition: all 0.2s ease;
		margin-left: 4px;
	}

	.signin-link a:hover {
		text-decoration: underline;
		color: var(--color-gradient-purple-mid);
	}

	/* Tablet - Maintain Vertical Layout */
	@media (min-width: 769px) and (max-width: 1023px) {
		.content-wrapper {
			max-width: 700px;
			padding: 50px 30px;
		}

		.header-section {
			text-align: center;
		}
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.waiting-list-page {
			padding-left: 0.75rem;
			padding-right: 0.75rem;
			padding-bottom: 0.75rem;
		}

		.mobile-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			padding: 12px;
			background: linear-gradient(
				to bottom,
				rgba(255, 255, 255, 0.95) 0%,
				rgba(255, 255, 255, 0.85) 30%,
				rgba(255, 255, 255, 0.5) 50%,
				rgba(255, 255, 255, 0.2) 70%,
				rgba(255, 255, 255, 0) 100%
			);
			backdrop-filter: blur(20px) saturate(180%);
			z-index: 1000;
		}

		.mobile-header .back-button-mobile {
			position: relative;
			top: 0;
			left: 0;
			bottom: auto;
			width: 40px;
			height: 40px;
			margin: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 12px;
			background: rgba(255, 255, 255, 0.8);
			backdrop-filter: blur(20px) saturate(180%);
			border: 1px solid rgba(255, 255, 255, 0.4);
			color: var(--color-primary-dark);
			text-decoration: none;
			cursor: pointer;
			transition: all 0.3s ease;
		}

		.mobile-header .back-button-mobile:hover {
			background: rgba(255, 255, 255, 0.95);
			transform: translateY(-1px);
		}

		.badge-mobile {
			display: inline-flex;
		}

		.badge-desktop {
			display: none;
		}

		.mobile-header .badge {
			position: relative;
			top: 0;
			right: 0;
			margin: 0;
			z-index: 1;
		}

		.back-button {
			display: none;
		}

		.badge-desktop {
			display: none !important;
		}

		.content-wrapper {
			padding: 20px 0;
			gap: 32px;
			margin-top: 64px;
		}

		.header-section {
			margin-bottom: 0;
			text-align: center;
			position: relative;
			padding-top: 0;
		}

		.header-section .title {
			text-align: left;
		}

		.badge {
			font-size: 0.85em;
			padding: 0 14px;
			height: 40px;
			border-radius: 12px;
			display: inline-flex;
			align-items: center;
			justify-content: center;
		}

		.subtitle {
			margin: 0;
			text-align: left;
		}

		.form-card {
			padding: 20px 18px;
			border-radius: 16px;
		}

		.waiting-list-form {
			gap: 12px;
		}

		.form-field input,
		.select-field {
			padding: 10px 12px 10px 38px;
		}

		.form-row-mobile {
			flex-direction: row;
			gap: 10px;
		}

		.form-row-mobile .form-field {
			flex: 1;
		}

		.submit-button {
			padding: 11px 24px;
			font-size: 0.95em;
		}
	}

	@media (max-width: 480px) {
		.waiting-list-page {
			padding: 12px;
		}

		.form-card {
			padding: 18px 16px;
		}

		.blob {
			display: none;
		}
	}

	/* Landscape mobile orientation */
	@media (max-height: 600px) and (orientation: landscape) {
		.waiting-list-page {
			padding: 12px;
		}

		.content-wrapper {
			padding: 10px 0;
			gap: 20px;
		}

		.header-section {
			margin-bottom: 0;
		}

		.form-card {
			padding: 18px;
		}

		/* In landscape, if width allows, show side-by-side */
		@media (min-width: 900px) {
			.content-wrapper {
				flex-direction: row;
				align-items: flex-start;
				gap: 40px;
				max-width: 1000px;
			}

			.header-section {
				text-align: left;
				flex: 0 0 45%;
				position: sticky;
				top: 80px;
			}

			.badge {
				margin-left: 0;
				margin-right: auto;
			}

			.subtitle {
				margin: 0;
				max-width: 100%;
			}

			.form-card {
				flex: 1;
			}
		}
	}

	/* Reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.blob,
		.badge,
		.title,
		.subtitle,
		.form-card {
			animation: none;
			transition: none;
		}
	}

	/* Toaster Custom Positioning - svelte-toast uses body append */
	#toast-container {
		position: fixed;
		z-index: 9999;
	}

	/* Mobile positioning - above content, not overlapping mobile header */
	@media (max-width: 768px) {
		#toast-container {
			bottom: 20px !important;
			right: 12px !important;
			left: auto !important;
		}
	}

	/* Desktop and tablet positioning */
	@media (min-width: 769px) {
		#toast-container {
			bottom: 24px !important;
			right: 24px !important;
			left: auto !important;
		}
	}
</style>
