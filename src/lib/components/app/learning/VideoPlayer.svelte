<script lang="ts">
	import { COLOR, RADIUS, ELEVATION, TRANSITION, TEXT } from '$lib/config/design';

	interface Props {
		src: string;
		lessonId: string;
		courseId: string;
		initialPosition?: number;
		onComplete?: () => void;
	}

	let { src, lessonId, courseId, initialPosition = 0, onComplete }: Props = $props();

	let videoEl = $state<HTMLVideoElement | null>(null);
	let playbackRate = $state(1);
	let completed = $state(false);

	const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

	// Set initial position on mount
	$effect(() => {
		if (videoEl && initialPosition > 0) {
			videoEl.currentTime = initialPosition / 1000;
		}
	});

	// Apply playback rate
	$effect(() => {
		if (videoEl) {
			videoEl.playbackRate = playbackRate;
		}
	});

	// Save progress every 10 seconds via debounce
	let saveTimer: ReturnType<typeof setTimeout> | null = null;

	function scheduleProgressSave(positionMs: number, isCompleted: boolean) {
		if (saveTimer) clearTimeout(saveTimer);
		saveTimer = setTimeout(async () => {
			try {
				await fetch('/api/progress', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						courseId,
						lessonId,
						lastPositionMs: positionMs,
						completed: isCompleted
					})
				});
			} catch {
				// Silently fail — progress save is best-effort
			}
		}, 10_000);
	}

	function handleTimeUpdate() {
		if (!videoEl) return;
		const posMs = Math.floor(videoEl.currentTime * 1000);
		const ratio = videoEl.duration > 0 ? videoEl.currentTime / videoEl.duration : 0;

		if (!completed && ratio >= 0.9) {
			completed = true;
			scheduleProgressSave(posMs, true);
			onComplete?.();
		} else {
			scheduleProgressSave(posMs, false);
		}
	}

	// Keyboard shortcuts
	$effect(() => {
		function handleKey(e: KeyboardEvent) {
			if (!videoEl) return;
			// Ignore if focus is on input/textarea
			const tag = (e.target as HTMLElement)?.tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA') return;

			if (e.code === 'Space') {
				e.preventDefault();
				videoEl.paused ? videoEl.play() : videoEl.pause();
			} else if (e.code === 'ArrowLeft') {
				e.preventDefault();
				videoEl.currentTime = Math.max(0, videoEl.currentTime - 10);
			} else if (e.code === 'ArrowRight') {
				e.preventDefault();
				videoEl.currentTime = Math.min(videoEl.duration, videoEl.currentTime + 10);
			} else if (e.code === 'KeyF') {
				e.preventDefault();
				if (document.fullscreenElement) {
					document.exitFullscreen();
				} else {
					videoEl.requestFullscreen();
				}
			}
		}

		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	});
</script>

<div class={`relative w-full overflow-hidden ${RADIUS.card} ${ELEVATION.card} bg-black`}>
	<!-- Video element -->
	<video
		bind:this={videoEl}
		{src}
		class="w-full"
		controls
		ontimeupdate={handleTimeUpdate}
		aria-label="Course video player"
	>
		<track kind="captions" />
	</video>

	<!-- Controls bar -->
	<div class={`flex items-center gap-3 px-4 py-3 ${COLOR.card} ${COLOR.cardBorder} border-t`}>
		<span class={`${TEXT.small} ${COLOR.textMuted}`}>Speed:</span>
		<div class="flex items-center gap-1">
			{#each speeds as speed}
				<button
					onclick={() => (playbackRate = speed)}
					class={`px-2 py-1 text-xs font-semibold ${RADIUS.small} ${TRANSITION.colors} ${
						playbackRate === speed
							? `${COLOR.accentBg} text-white`
							: `${COLOR.neutral} ${COLOR.textSecondary} hover:bg-zinc-200 dark:hover:bg-zinc-700`
					}`}
					aria-label="Set playback speed to {speed}x"
					aria-pressed={playbackRate === speed}
				>
					{speed}x
				</button>
			{/each}
		</div>

		{#if completed}
			<span
				class="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
			>
				<span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
				Selesai
			</span>
		{/if}
	</div>
</div>
