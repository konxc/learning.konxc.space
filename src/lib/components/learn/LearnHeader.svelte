<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	interface TrackInfo {
		label: string;
		icon: string;
		color: string;
	}

	interface LearnHeaderProps {
		courseTitle: string;
		progressPercent: number;
		enrollmentTrack?: string;
		mobileMenuOpen: boolean;
		onToggleMobileMenu: () => void;
	}

	let {
		courseTitle,
		progressPercent,
		enrollmentTrack,
		mobileMenuOpen,
		onToggleMobileMenu
	}: LearnHeaderProps = $props();

	const trackMap: Record<string, TrackInfo> = {
		creator: { label: 'Creator', icon: '🎥', color: 'text-blue-500' },
		seller: { label: 'Seller', icon: '🛒', color: 'text-emerald-500' },
		affiliate: { label: 'Affiliate', icon: '🔗', color: 'text-purple-500' }
	};
</script>

<header
	class="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80"
>
	<div class="mx-auto flex h-20 items-center justify-between px-8">
		<div class="flex items-center gap-6">
			<a
				href="/app/learning"
				class="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 transition-all hover:border-blue-500/30 hover:text-blue-600 dark:border-zinc-800"
			>
				<Icon name="arrow-left" size={20} />
			</a>
			<div class="mr-4 h-10 w-px bg-zinc-200 dark:bg-zinc-800"></div>
			<div class="flex flex-col">
				<p
					class="mb-1 text-[9px] leading-none font-black tracking-widest text-zinc-400 uppercase italic"
				>
					Active Spec
				</p>
				<h2
					class="text-lg leading-none font-black tracking-tighter text-zinc-900 uppercase italic dark:text-white"
				>
					{courseTitle}
				</h2>
			</div>
		</div>

		<div class="hidden items-center gap-8 md:flex">
			<div class="flex flex-col items-end">
				<div class="mb-1.5 flex items-center gap-3">
					<span class="text-[9px] font-black tracking-widest text-zinc-400 uppercase"
						>Completion Protocol</span
					>
					<span class="text-xs font-black text-blue-600 italic">{progressPercent}% Verified</span>
				</div>
				<div
					class="h-1.5 w-48 overflow-hidden rounded-full bg-zinc-100 shadow-inner dark:bg-zinc-800"
				>
					<div
						class="h-full bg-linear-to-r from-blue-600 to-indigo-500 transition-all duration-1000"
						style="width: {progressPercent}%"
					></div>
				</div>
			</div>

			<div class="flex items-center gap-3">
				<div class="h-10 w-px bg-zinc-200 dark:bg-zinc-800"></div>
				{#if enrollmentTrack && trackMap[enrollmentTrack]}
					<div
						class="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
					>
						<span class="text-lg">{trackMap[enrollmentTrack].icon}</span>
						<span
							class="text-[10px] font-black tracking-widest text-zinc-600 uppercase italic dark:text-zinc-400"
						>
							{trackMap[enrollmentTrack].label}
						</span>
					</div>
				{/if}
			</div>
		</div>

		<button
			class="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white md:hidden"
			onclick={onToggleMobileMenu}
		>
			<Icon name={mobileMenuOpen ? 'x' : 'layers'} size={20} />
		</button>
	</div>
</header>
