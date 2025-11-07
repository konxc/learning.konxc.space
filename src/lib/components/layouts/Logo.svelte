<script lang="ts">
	import { COLOR, TRANSITION } from '$lib/config/design';

	let { size = 'md', showText = true }: { size?: 'sm' | 'md' | 'lg'; showText?: boolean } =
		$props();

	const sizeClasses = {
		sm: 'text-lg',
		md: 'text-xl',
		lg: 'text-2xl'
	};

	const iconSizeClasses = {
		sm: 'h-5 w-5',
		md: 'h-6 w-6',
		lg: 'h-8 w-8'
	};

	// Magnetic hover effect
	let logoLinkRef: HTMLAnchorElement | null = $state(null);
	let mouseX = $state(0);
	let mouseY = $state(0);

	function handleMouseMove(e: MouseEvent) {
		if (!logoLinkRef) return;
		const rect = logoLinkRef.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		mouseX = ((e.clientX - centerX) / rect.width) * 10;
		mouseY = ((e.clientY - centerY) / rect.height) * 10;
	}

	function handleMouseLeave() {
		mouseX = 0;
		mouseY = 0;
	}
</script>

<a
	bind:this={logoLinkRef}
	href="/dashboard"
	class={`logo-link inline-flex items-center gap-2 no-underline ${TRANSITION.all} hover:scale-105 active:scale-95`}
	aria-label="Naik Kelas - Home"
	onmousemove={handleMouseMove}
	onmouseleave={handleMouseLeave}
	style={`transform: translate(${mouseX}px, ${mouseY}px);`}
>
	<!-- Playful logo dengan gradient dan animation -->
	<div
		class={`logo-icon relative ${iconSizeClasses[size]} flex items-center justify-center overflow-visible rounded-lg shadow-sm`}
		style={`transform: rotateY(${mouseX * 2}deg) rotateX(${mouseY * -2}deg);`}
	>
		<!-- Rotating gradient background -->
		<div
			class="logo-gradient absolute inset-0 rounded-lg bg-linear-to-br from-blue-500 via-purple-500 to-pink-500"
		></div>

		<!-- Shine effect overlay -->
		<div class="logo-shine absolute inset-0 rounded-lg opacity-0"></div>

		<!-- Pulse ring effect -->
		<div class="logo-ring absolute inset-0 rounded-lg"></div>

		<!-- Book emoji dengan subtle animation -->
		<span class="logo-book relative z-10 text-white drop-shadow-sm">📚</span>

		<!-- Multiple sparkle effects dengan timing berbeda -->
		<span class="sparkle sparkle-1 absolute -top-0.5 -right-0.5 text-xs" aria-hidden="true">✨</span
		>
		<span class="sparkle sparkle-2 absolute -bottom-0.5 -left-0.5 text-[10px]" aria-hidden="true"
			>⭐</span
		>
		<span class="sparkle sparkle-3 absolute top-1 right-1 text-[8px] opacity-60" aria-hidden="true"
			>💫</span
		>

		<!-- Particle trail effect -->
		<div class="particles pointer-events-none absolute inset-0 rounded-lg"></div>
	</div>

	<!-- Brand name dengan playful typography dan animation -->
	{#if showText}
		<span class={`logo-text ${sizeClasses[size]} font-bold tracking-tight ${COLOR.textPrimary}`}>
			<span
				class="logo-word-naik bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400"
			>
				Naik
			</span>
			<span class="logo-word-kelas">Kelas</span>
		</span>
	{/if}

	<!-- Random rocket animations - Di level parent untuk mencakup logo icon dan text -->
	<div class="rockets-container">
		<span class="rocket rocket-1 absolute" aria-hidden="true">🚀</span>
		<span class="rocket rocket-2 absolute" aria-hidden="true">🚀</span>
		<span class="rocket rocket-3 absolute" aria-hidden="true">🚀</span>
		<span class="rocket rocket-4 absolute" aria-hidden="true">🚀</span>
		<span class="rocket rocket-5 absolute" aria-hidden="true">🚀</span>
		<span class="rocket rocket-6 absolute" aria-hidden="true">🚀</span>
	</div>
</a>

<style>
	/* Rotating gradient animation dengan lebih smooth */
	.logo-gradient {
		animation: gradientRotate 8s ease-in-out infinite;
		background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899, #f472b6, #3b82f6);
		background-size: 300% 300%;
		filter: brightness(1.1) saturate(1.2);
	}

	@keyframes gradientRotate {
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

	/* Shine/Shimmer effect */
	.logo-shine {
		background: linear-gradient(
			110deg,
			transparent 40%,
			rgba(255, 255, 255, 0.5) 50%,
			transparent 60%
		);
		background-size: 200% 100%;
		animation: shine 4s ease-in-out infinite;
		mix-blend-mode: overlay;
	}

	@keyframes shine {
		0% {
			background-position: -200% 0;
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			background-position: 200% 0;
			opacity: 0;
		}
	}

	/* Pulse ring effect */
	.logo-ring {
		border: 2px solid rgba(59, 130, 246, 0.4);
		animation: ringPulse 2s ease-out infinite;
		pointer-events: none;
	}

	@keyframes ringPulse {
		0% {
			transform: scale(1);
			opacity: 0.8;
		}
		100% {
			transform: scale(1.5);
			opacity: 0;
		}
	}

	/* Continuous gentle floating for book icon */
	.logo-book {
		animation: gentleFloat 3s ease-in-out infinite;
	}

	@keyframes gentleFloat {
		0%,
		100% {
			transform: translateY(0) rotate(0deg);
		}
		25% {
			transform: translateY(-1px) rotate(-1deg);
		}
		50% {
			transform: translateY(-2px) rotate(0deg);
		}
		75% {
			transform: translateY(-1px) rotate(1deg);
		}
	}

	/* Multiple sparkle animations dengan timing berbeda */
	.sparkle-1 {
		animation: sparkle1 3s ease-in-out infinite;
		opacity: 0.7;
	}

	.sparkle-2 {
		animation: sparkle2 4s ease-in-out infinite;
		opacity: 0.6;
		animation-delay: 0.5s;
	}

	.sparkle-3 {
		animation: sparkle3 2.5s ease-in-out infinite;
		opacity: 0.5;
		animation-delay: 1s;
	}

	@keyframes sparkle1 {
		0%,
		100% {
			opacity: 0.5;
			transform: scale(1) rotate(0deg) translate(0, 0);
		}
		50% {
			opacity: 1;
			transform: scale(1.3) rotate(180deg) translate(2px, -2px);
		}
	}

	@keyframes sparkle2 {
		0%,
		100% {
			opacity: 0.4;
			transform: scale(1) rotate(0deg) translate(0, 0);
		}
		50% {
			opacity: 0.9;
			transform: scale(1.2) rotate(-180deg) translate(-2px, 2px);
		}
	}

	@keyframes sparkle3 {
		0%,
		100% {
			opacity: 0.3;
			transform: scale(1) rotate(0deg);
		}
		50% {
			opacity: 0.8;
			transform: scale(1.4) rotate(360deg);
		}
	}

	/* Word bounce animation untuk text */
	.logo-word-naik {
		display: inline-block;
		animation: wordBounce 2.5s ease-in-out infinite;
	}

	.logo-word-kelas {
		display: inline-block;
		animation: wordBounce 2.5s ease-in-out infinite;
		animation-delay: 0.3s;
	}

	@keyframes wordBounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-2px);
		}
	}

	/* Enhanced hover effects */
	.logo-link:hover .logo-icon {
		animation: hoverBounce 0.6s ease-in-out;
		transform: scale(1.08) !important;
		filter: drop-shadow(0 10px 25px rgba(59, 130, 246, 0.4));
	}

	.logo-link:hover .logo-gradient {
		animation:
			gradientRotate 3s ease-in-out infinite,
			pulseGlow 1.5s ease-in-out infinite;
		filter: brightness(1.2) saturate(1.3);
	}

	.logo-link:hover .logo-shine {
		animation: shine 2s ease-in-out infinite;
		opacity: 1;
	}

	.logo-link:hover .logo-ring {
		animation: ringPulse 1s ease-out infinite;
	}

	.logo-link:hover .logo-book {
		animation:
			gentleFloat 1.5s ease-in-out infinite,
			bookWiggle 0.5s ease-in-out,
			bookPulse 2s ease-in-out infinite;
	}

	.logo-link:hover .sparkle {
		opacity: 1 !important;
		transform: scale(1.2);
	}

	.logo-link:hover .particles {
		opacity: 1;
		animation: particlesFloat 3s ease-in-out infinite;
	}

	/* Rocket animations */
	.logo-link {
		position: relative;
	}

	.rockets-container {
		position: absolute;
		top: -20px;
		left: -30px;
		right: -30px;
		bottom: -20px;
		opacity: 0;
		transition: opacity 0.3s ease;
		pointer-events: none;
		overflow: visible;
	}

	.logo-link:hover .rockets-container {
		opacity: 1;
	}

	.rocket {
		font-size: 1.25rem;
		opacity: 0;
		z-index: 30;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
	}

	/* Rocket 1: Bottom left to top right */
	.rocket-1 {
		left: 5%;
		top: 110%;
		animation: rocketRandom1 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
	}

	/* Rocket 2: Bottom center to top */
	.rocket-2 {
		left: 50%;
		top: 110%;
		animation: rocketRandom2 2.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
		animation-delay: 0.3s;
	}

	/* Rocket 3: Bottom right to top left */
	.rocket-3 {
		left: 95%;
		top: 110%;
		animation: rocketRandom3 2.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
		animation-delay: 0.6s;
	}

	/* Rocket 4: Left side to top right */
	.rocket-4 {
		left: -8%;
		top: 50%;
		animation: rocketRandom4 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
		animation-delay: 0.9s;
	}

	/* Rocket 5: Right side of text to top left (di atas text area) */
	.rocket-5 {
		left: 88%;
		top: 15%;
		animation: rocketRandom5 2.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
		animation-delay: 1.2s;
	}

	/* Rocket 6: Bottom right text area to top */
	.rocket-6 {
		left: 65%;
		top: 110%;
		animation: rocketRandom6 2.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
		animation-delay: 1.5s;
	}

	/* Rocket Trail Effect */
	.rocket::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		width: 3px;
		height: 20px;
		background: linear-gradient(
			to bottom,
			transparent,
			rgba(59, 130, 246, 0.8),
			rgba(139, 92, 246, 0.6),
			rgba(236, 72, 153, 0.4)
		);
		transform: translate(-50%, 100%) rotate(180deg);
		filter: blur(3px);
		opacity: 0;
		animation: rocketTrail 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}

	.rocket-1::after {
		animation: rocketTrail 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
	}

	.rocket-2::after {
		animation: rocketTrail 2.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
		animation-delay: 0.3s;
	}

	.rocket-3::after {
		animation: rocketTrail 2.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
		animation-delay: 0.6s;
	}

	.rocket-4::after {
		animation: rocketTrail 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
		animation-delay: 0.9s;
	}

	.rocket-5::after {
		animation: rocketTrail 2.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
		animation-delay: 1.2s;
	}

	.rocket-6::after {
		animation: rocketTrail 2.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
		animation-delay: 1.5s;
	}

	/* Rocket Animation Keyframes - Balanced Random Paths dengan rotasi smooth */
	@keyframes rocketRandom1 {
		/* Bottom left → Top right (diagonal) dengan rotasi halus */
		0% {
			opacity: 0;
			transform: translate(0, 0) rotate(-45deg) scale(0.5);
		}
		5% {
			opacity: 1;
			transform: translate(10px, -30px) rotate(-42deg) scale(0.8);
		}
		15% {
			transform: translate(20px, -55px) rotate(-39deg) scale(0.9);
		}
		25% {
			transform: translate(35px, -85px) rotate(-36deg) scale(1);
		}
		35% {
			transform: translate(50px, -120px) rotate(-34deg) scale(1.05);
		}
		50% {
			transform: translate(70px, -170px) rotate(-32deg) scale(1.1);
		}
		65% {
			transform: translate(95px, -220px) rotate(-30deg) scale(1.05);
		}
		75% {
			transform: translate(120px, -270px) rotate(-28deg) scale(1);
		}
		85% {
			transform: translate(150px, -320px) rotate(-26deg) scale(0.9);
		}
		100% {
			opacity: 0;
			transform: translate(180px, -380px) rotate(-24deg) scale(0.7);
		}
	}

	@keyframes rocketRandom2 {
		/* Bottom center → Top center (lurus ke atas dengan goyangan halus) */
		0% {
			opacity: 0;
			transform: translate(0, 0) rotate(0deg) scale(0.5);
		}
		5% {
			opacity: 1;
			transform: translate(2px, -25px) rotate(3deg) scale(0.8);
		}
		15% {
			transform: translate(-2px, -55px) rotate(-2deg) scale(0.9);
		}
		25% {
			transform: translate(3px, -85px) rotate(4deg) scale(1);
		}
		35% {
			transform: translate(-1px, -120px) rotate(-1deg) scale(1.05);
		}
		50% {
			transform: translate(2px, -170px) rotate(2deg) scale(1.1);
		}
		65% {
			transform: translate(-3px, -220px) rotate(-3deg) scale(1.05);
		}
		75% {
			transform: translate(1px, -270px) rotate(1deg) scale(1);
		}
		85% {
			transform: translate(-2px, -320px) rotate(-2deg) scale(0.9);
		}
		100% {
			opacity: 0;
			transform: translate(0, -380px) rotate(0deg) scale(0.7);
		}
	}

	@keyframes rocketRandom3 {
		/* Bottom right → Top left (diagonal berlawanan dengan rotasi halus) */
		0% {
			opacity: 0;
			transform: translate(0, 0) rotate(45deg) scale(0.5);
		}
		5% {
			opacity: 1;
			transform: translate(-10px, -30px) rotate(42deg) scale(0.8);
		}
		15% {
			transform: translate(-20px, -55px) rotate(39deg) scale(0.9);
		}
		25% {
			transform: translate(-35px, -85px) rotate(36deg) scale(1);
		}
		35% {
			transform: translate(-50px, -120px) rotate(34deg) scale(1.05);
		}
		50% {
			transform: translate(-70px, -170px) rotate(32deg) scale(1.1);
		}
		65% {
			transform: translate(-95px, -220px) rotate(30deg) scale(1.05);
		}
		75% {
			transform: translate(-120px, -270px) rotate(28deg) scale(1);
		}
		85% {
			transform: translate(-150px, -320px) rotate(26deg) scale(0.9);
		}
		100% {
			opacity: 0;
			transform: translate(-180px, -380px) rotate(24deg) scale(0.7);
		}
	}

	@keyframes rocketRandom4 {
		/* Left middle → Top right (lengkung dengan rotasi halus) */
		0% {
			opacity: 0;
			transform: translate(0, 0) rotate(30deg) scale(0.5);
		}
		5% {
			opacity: 1;
			transform: translate(18px, -25px) rotate(31deg) scale(0.8);
		}
		15% {
			transform: translate(35px, -55px) rotate(33deg) scale(0.9);
		}
		25% {
			transform: translate(55px, -85px) rotate(35deg) scale(1);
		}
		35% {
			transform: translate(80px, -120px) rotate(36deg) scale(1.05);
		}
		50% {
			transform: translate(110px, -170px) rotate(38deg) scale(1.1);
		}
		65% {
			transform: translate(145px, -220px) rotate(39deg) scale(1.05);
		}
		75% {
			transform: translate(180px, -270px) rotate(40deg) scale(1);
		}
		85% {
			transform: translate(220px, -320px) rotate(41deg) scale(0.9);
		}
		100% {
			opacity: 0;
			transform: translate(260px, -380px) rotate(42deg) scale(0.7);
		}
	}

	@keyframes rocketRandom5 {
		/* Right side → Top left (di atas text area dengan rotasi halus) */
		0% {
			opacity: 0;
			transform: translate(0, 0) rotate(-30deg) scale(0.5);
		}
		5% {
			opacity: 1;
			transform: translate(-18px, -30px) rotate(-28deg) scale(0.8);
		}
		15% {
			transform: translate(-35px, -60px) rotate(-26deg) scale(0.9);
		}
		25% {
			transform: translate(-55px, -90px) rotate(-24deg) scale(1);
		}
		35% {
			transform: translate(-80px, -125px) rotate(-22deg) scale(1.05);
		}
		50% {
			transform: translate(-110px, -175px) rotate(-20deg) scale(1.1);
		}
		65% {
			transform: translate(-145px, -225px) rotate(-19deg) scale(1.05);
		}
		75% {
			transform: translate(-180px, -275px) rotate(-18deg) scale(1);
		}
		85% {
			transform: translate(-220px, -325px) rotate(-17deg) scale(0.9);
		}
		100% {
			opacity: 0;
			transform: translate(-260px, -380px) rotate(-16deg) scale(0.7);
		}
	}

	@keyframes rocketRandom6 {
		/* Bottom right text area → Top center dengan goyangan halus */
		0% {
			opacity: 0;
			transform: translate(0, 0) rotate(20deg) scale(0.5);
		}
		5% {
			opacity: 1;
			transform: translate(-10px, -28px) rotate(19deg) scale(0.8);
		}
		15% {
			transform: translate(-20px, -58px) rotate(17deg) scale(0.9);
		}
		25% {
			transform: translate(-32px, -88px) rotate(15deg) scale(1);
		}
		35% {
			transform: translate(-45px, -125px) rotate(13deg) scale(1.05);
		}
		50% {
			transform: translate(-60px, -175px) rotate(11deg) scale(1.1);
		}
		65% {
			transform: translate(-75px, -225px) rotate(9deg) scale(1.05);
		}
		75% {
			transform: translate(-90px, -275px) rotate(8deg) scale(1);
		}
		85% {
			transform: translate(-110px, -325px) rotate(7deg) scale(0.9);
		}
		100% {
			opacity: 0;
			transform: translate(-130px, -380px) rotate(6deg) scale(0.7);
		}
	}

	@keyframes rocketTrail {
		0% {
			opacity: 0;
			height: 0;
			transform: translate(-50%, 100%) rotate(180deg);
		}
		10% {
			opacity: 1;
			height: 15px;
		}
		30% {
			height: 25px;
			opacity: 0.9;
		}
		50% {
			height: 30px;
			opacity: 0.7;
		}
		75% {
			height: 25px;
			opacity: 0.5;
		}
		100% {
			opacity: 0;
			height: 0;
		}
	}

	.logo-link:hover .logo-word-naik {
		animation: wordBounce 0.6s ease-in-out infinite;
	}

	.logo-link:hover .logo-word-kelas {
		animation: wordSlide 0.6s ease-in-out infinite;
	}

	@keyframes hoverBounce {
		0%,
		100% {
			transform: translateY(0) scale(1);
		}
		50% {
			transform: translateY(-3px) scale(1.05);
		}
	}

	@keyframes pulseGlow {
		0%,
		100% {
			box-shadow:
				0 0 10px rgba(59, 130, 246, 0.4),
				0 0 20px rgba(139, 92, 246, 0.2),
				inset 0 0 10px rgba(236, 72, 153, 0.1);
		}
		50% {
			box-shadow:
				0 0 25px rgba(139, 92, 246, 0.6),
				0 0 40px rgba(236, 72, 153, 0.3),
				inset 0 0 15px rgba(59, 130, 246, 0.2);
		}
	}

	@keyframes bookPulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
	}

	/* Particle trail effect */
	.particles {
		opacity: 0;
		background-image:
			radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 50%),
			radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
			radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.2) 0%, transparent 50%);
		background-size:
			50% 50%,
			50% 50%,
			100% 100%;
		background-position:
			0% 0%,
			100% 100%,
			50% 50%;
		transition: opacity 0.3s ease;
	}

	@keyframes particlesFloat {
		0%,
		100% {
			background-position:
				0% 0%,
				100% 100%,
				50% 50%;
			opacity: 0.6;
		}
		50% {
			background-position:
				20% 20%,
				80% 80%,
				40% 60%;
			opacity: 1;
		}
	}

	@keyframes bookWiggle {
		0%,
		100% {
			transform: rotate(0deg);
		}
		25% {
			transform: rotate(-3deg);
		}
		75% {
			transform: rotate(3deg);
		}
	}

	@keyframes wordSlide {
		0% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(2px);
		}
		100% {
			transform: translateX(0);
		}
	}

	/* 3D transform perspective untuk parent */
	.logo-link {
		perspective: 1000px;
		transform-style: preserve-3d;
		transition: transform 0.1s ease-out;
	}

	.logo-icon {
		transform-style: preserve-3d;
		transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
	}

	/* Reduced motion untuk a11y */
	@media (prefers-reduced-motion: reduce) {
		.logo-gradient,
		.logo-book,
		.sparkle,
		.logo-word-naik,
		.logo-word-kelas,
		.logo-shine,
		.logo-ring,
		.particles,
		.rocket,
		.rocket::after,
		.rockets-container {
			animation: none !important;
		}

		.logo-link:hover .logo-icon {
			transform: scale(1.02) !important;
		}

		.logo-link {
			transform: none !important;
		}

		.logo-icon {
			transform: none !important;
		}

		.rockets-container {
			opacity: 0 !important;
		}
	}
</style>
