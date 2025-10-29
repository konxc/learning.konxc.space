<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { onMount } from 'svelte';

	let { form }: { form: ActionData } = $props();

	let mouseX = $state(0);
	let mouseY = $state(0);
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});

	function handleMouseMove(event: MouseEvent) {
		mouseX = event.clientX;
		mouseY = event.clientY;
	}
</script>

<svelte:head>
	<title>Join Waiting List - Naik Kelas</title>
</svelte:head>

<div class="waiting-list-page" onmousemove={handleMouseMove}>
	<!-- Animated Background Elements -->
	<div class="bg-gradient"></div>
	<div class="bg-blobs">
		<div class="blob blob-1"></div>
		<div class="blob blob-2"></div>
		<div class="blob blob-3"></div>
	</div>

	<!-- Back to Home Button -->
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

	<!-- Main Content -->
	<div class="content-wrapper">
		<!-- Header Section -->
		<div class="header-section">
			<div class="badge" class:fade-in={mounted}>✨ Join Waiting List</div>
			<h1 class="title" class:fade-in={mounted} style="--delay: 0.1s">
				Mulai Perjalananmu
				<span class="gradient-text">Jadi Developer Profesional</span>
			</h1>
			<p class="subtitle" class:fade-in={mounted} style="--delay: 0.2s">
				Dapatkan update pembukaan batch dan penawaran khusus untuk kamu yang ingin memulai
				perjalanan belajar jadi developer profesional!
			</p>
		</div>

		<!-- Form Card -->
		<div class="form-card" class:fade-in={mounted} style="--delay: 0.3s">
			{#if form?.error}
				<div class="message error-message" role="alert">
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
						<circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="2" />
						<path
							d="M10 6v4M10 14h.01"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
						/>
					</svg>
					<span>{form.error}</span>
				</div>
			{/if}

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
						Kamu telah berhasil mendaftar di waiting list. Kami akan menghubungi kamu segera setelah
						batch dibuka.
					</p>
					<a href="/" class="home-link">Kembali ke Beranda</a>
				</div>
			{:else}
				<form method="POST" action="?/join" class="waiting-list-form" use:enhance>
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
								autocomplete="name"
							/>
						</div>
					</div>

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
								placeholder="email@example.com"
								required
								autocomplete="email"
							/>
						</div>
					</div>

					<!-- Phone Field -->
					<div class="form-field">
						<label for="phone">
							<span>No. HP</span>
							<span class="optional">(Opsional)</span>
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
							<select id="interest" name="interest" class="select-field">
								<option value="">Pilih minat kamu</option>
								<option value="python">🐍 Python Programming</option>
								<option value="web">🌐 Web Development</option>
								<option value="fullstack">🚀 Full Stack Development</option>
								<option value="career-switch">💼 Career Switch ke Tech</option>
								<option value="upskill">📈 Upskill Development Skills</option>
							</select>
						</div>
					</div>

					<input type="hidden" name="source" value="landing-cta" />

					<!-- Submit Button -->
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
	@import '../../../app.css';

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

	/* Back Button - Glassmorphism yang selaras dengan form */
	.back-button {
		position: fixed;
		top: 24px;
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

	.back-button span {
		display: none;
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

	.gradient-text {
		display: block;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 50%,
			var(--color-gradient-purple-end) 100%
		);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
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
		}

		.content-wrapper {
			max-width: 1200px;
			flex-direction: row;
			align-items: flex-start;
			gap: 48px;
			padding: 20px 0;
			min-height: calc(100vh - 40px);
		}

		.header-section {
			text-align: left;
			flex: 0 0 480px;
			max-width: 480px;
			padding-right: 16px;
			position: sticky;
			top: 20px;
			align-self: flex-start;
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
			max-width: 520px;
			margin-left: auto;
			padding: 28px;
		}

		.waiting-list-form {
			gap: 16px;
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

	/* Form Card - Glassmorphism */
	.form-card {
		background: rgba(255, 255, 255, 0.8);
		backdrop-filter: blur(40px) saturate(180%);
		border: 1px solid rgba(255, 255, 255, 0.4);
		border-radius: 20px;
		padding: 32px;
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

	/* Messages */
	.message {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px 20px;
		border-radius: 12px;
		margin-bottom: 24px;
		font-size: 0.95em;
		animation: slideIn 0.3s ease-out;
	}

	.error-message {
		background: rgba(254, 226, 226, 0.9);
		color: #dc2626;
		border: 1px solid rgba(220, 38, 38, 0.2);
	}

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

	/* Form Styles - Compact */
	.waiting-list-form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.form-field {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.form-field label {
		display: flex;
		align-items: center;
		gap: 6px;
		font-weight: 600;
		color: var(--color-primary-dark);
		font-size: 0.9em;
	}

	.required {
		color: #ef4444;
	}

	.optional {
		font-weight: 400;
		color: var(--color-primary-medium);
		font-size: 0.85em;
	}

	.input-wrapper,
	.select-wrapper {
		position: relative;
	}

	.input-icon,
	.select-icon {
		position: absolute;
		left: 14px;
		top: 50%;
		transform: translateY(-50%);
		color: var(--color-primary-medium);
		pointer-events: none;
		z-index: 1;
		width: 18px;
		height: 18px;
	}

	.form-field input,
	.select-field {
		width: 100%;
		padding: 12px 14px 12px 44px;
		border: 2px solid rgba(229, 231, 235, 0.8);
		border-radius: 10px;
		font-size: 0.95em;
		font-family: inherit;
		background: rgba(255, 255, 255, 0.9);
		backdrop-filter: blur(10px);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		color: var(--color-primary-dark);
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
		right: 16px;
		left: auto;
		transition: transform 0.3s ease;
	}

	.select-field:focus + .select-icon,
	.select-wrapper:focus-within .select-icon {
		transform: translateY(-50%) rotate(180deg);
	}

	/* Submit Button - Compact */
	.submit-button {
		margin-top: 4px;
		padding: 14px 28px;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start) 0%,
			var(--color-gradient-purple-mid) 50%,
			var(--color-gradient-purple-end) 100%
		);
		color: white;
		border: none;
		border-radius: 10px;
		font-size: 1em;
		font-weight: 600;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
		position: relative;
		overflow: hidden;
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

	/* Sign In Link - Compact */
	.signin-link {
		margin-top: 20px;
		text-align: center;
		padding-top: 20px;
		border-top: 1px solid rgba(229, 231, 235, 0.5);
	}

	.signin-link p {
		color: var(--color-primary-medium);
		font-size: 0.95em;
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
			padding: 16px;
		}

		.back-button {
			top: 16px;
			left: 16px;
			width: 40px;
			height: 40px;
		}

		.content-wrapper {
			padding: 20px 0;
			gap: 32px;
		}

		.header-section {
			margin-bottom: 0;
			text-align: center;
		}

		.badge {
			font-size: 0.85em;
			padding: 6px 16px;
			margin-left: auto;
			margin-right: auto;
		}

		.subtitle {
			margin: 0 auto;
		}

		.form-card {
			padding: 32px 24px;
			border-radius: 20px;
		}

		.waiting-list-form {
			gap: 20px;
		}

		.form-field input,
		.select-field {
			padding: 12px 14px 12px 44px;
		}

		.submit-button {
			padding: 14px 28px;
			font-size: 1em;
		}
	}

	@media (max-width: 480px) {
		.waiting-list-page {
			padding: 12px;
		}

		.form-card {
			padding: 24px 20px;
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
			padding: 24px;
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
</style>
