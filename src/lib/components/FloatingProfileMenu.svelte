<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { get } from 'svelte/store';
	import { careerStore, type CareerOption } from '$lib/stores/career';

	interface Props {
		currentCareer?: CareerOption;
	}

	let { currentCareer }: Props = $props();

	let menuOpen = $state(false);
	let showMenu = $state(false);
	let profileDetailsRef: HTMLDetailsElement | null = $state(null);
	let menuContainerRef: HTMLDivElement | null = $state(null);

	// Career options untuk dropdown
	const careerOptions: CareerOption[] = [
		'Developer',
		'Akademik',
		'Bisnis & UMKM',
		'UI/UX Design',
		'Outdoor Adventure'
	];

	// Initialize state dengan currentCareer atau default
	let selectedCareer = $state<CareerOption>(
		currentCareer || (typeof window !== 'undefined' ? get(careerStore) : 'Developer')
	);

	// Initialize store dengan currentCareer jika ada
	if (currentCareer) {
		careerStore.set(currentCareer);
	}

	// Sync dengan store changes menggunakan $effect (runes mode)
	$effect(() => {
		if (typeof window === 'undefined') return;
		const unsubscribe = careerStore.subscribe((value) => {
			selectedCareer = value;
		});
		return unsubscribe;
	});

	// Detect ProgramSection visibility
	function handleScroll() {
		if (typeof document === 'undefined') return;
		const programSection = document.querySelector('#program');
		if (programSection) {
			const { top: programTop, bottom: programBottom } = programSection.getBoundingClientRect();
			const threshold = 100; // 100px before entering/exiting

			// Menu muncul saat sudah masuk (top <= 100px) dan belum keluar (bottom > 100px)
			const isInProgram = programTop <= threshold && programBottom > threshold;
			showMenu = isInProgram;
		} else {
			showMenu = false;
		}
	}

	// Click outside handler untuk menutup menu
	function handleClickOutside(event: MouseEvent) {
		if (!profileDetailsRef || !menuContainerRef || !profileDetailsRef.open) return;

		const target = event.target as Node | null;
		if (!target) return;

		// Cek apakah klik di luar menu container
		if (!menuContainerRef.contains(target)) {
			profileDetailsRef.open = false;
			menuOpen = false;
		}
	}

	function handleCareerChange(career: CareerOption) {
		careerStore.set(career);
		menuOpen = false;
		if (profileDetailsRef) {
			profileDetailsRef.open = false;
		}
	}

	onMount(() => {
		if (typeof window === 'undefined' || typeof document === 'undefined') return;

		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		document.addEventListener('click', handleClickOutside, true);

		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('scroll', handleScroll);
			}
			if (typeof document !== 'undefined') {
				document.removeEventListener('click', handleClickOutside, true);
			}
		};
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('scroll', handleScroll);
		}
		if (typeof document !== 'undefined') {
			document.removeEventListener('click', handleClickOutside, true);
		}
	});
</script>

{#if showMenu}
	<div
		class="floating-profile-menu fixed right-3 bottom-3 z-[1000] md:right-3 md:bottom-3"
		bind:this={menuContainerRef}
		in:fly={{ y: 50, duration: 400, easing: cubicOut }}
		out:fly={{ y: 50, duration: 300, easing: cubicOut }}
	>
		<details
			bind:this={profileDetailsRef}
			class="group"
			ontoggle={(e) => {
				menuOpen = (e.currentTarget as HTMLDetailsElement).open;
			}}
		>
			<summary
				class="profile-button flex cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-3 shadow-md backdrop-blur-sm transition-all duration-200 ease-out hover:border-gray-400 hover:bg-gray-50 hover:shadow-lg active:scale-95 md:px-6 md:py-3.5"
			>
				<span class="text-sm font-semibold text-gray-800 md:text-base">Lihat Karir</span>
				<svg
					class="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ease-out group-open:rotate-180"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</summary>

			<div
				class="absolute right-0 bottom-[60px] min-w-[220px] rounded-2xl border border-white/25 bg-white/95 p-2 shadow-xl backdrop-blur-[20px] md:min-w-[240px]"
				style="
					box-shadow:
						0 8px 32px rgba(31, 38, 135, 0.12),
						0 2px 8px rgba(0, 0, 0, 0.06),
						inset 0 1px 1px rgba(255, 255, 255, 0.6);
				"
			>
				<!-- Current Career Display -->
				<div class="mb-2 border-b border-gray-200/60 pb-2">
					<p class="px-3 py-1.5 text-xs font-medium text-gray-500">Kenali Karir Saat Ini</p>
					<p class="px-3 py-1 text-sm font-semibold text-gray-900">{selectedCareer}</p>
				</div>

				<!-- Career Options -->
				<div class="space-y-0.5">
					<p class="px-3 py-1.5 text-xs font-medium text-gray-500">Ubah Karir</p>
					{#each careerOptions as career}
						<button
							type="button"
							class="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors duration-200 hover:bg-teal-50 hover:text-teal-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 {selectedCareer ===
							career
								? 'bg-teal-100 font-medium text-teal-900'
								: ''}"
							onclick={() => handleCareerChange(career)}
						>
							{career}
						</button>
					{/each}
				</div>
			</div>
		</details>
	</div>
{/if}

<style>
	.profile-button {
		position: relative;
	}

	/* Active/Open state - clean dan solid tanpa glow */
	.floating-profile-menu details[open] .profile-button {
		border-color: rgba(20, 184, 166, 0.5);
		background: white;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	/* Animation untuk menu dropdown */
	.floating-profile-menu details > div {
		animation: fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(8px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	/* Enhanced focus state untuk accessibility */
	.profile-button:focus-visible {
		outline: 2px solid rgba(20, 184, 166, 0.8);
		outline-offset: 4px;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.profile-button {
			font-size: 0.875rem;
			padding: 0.625rem 1rem;
		}
	}
</style>
