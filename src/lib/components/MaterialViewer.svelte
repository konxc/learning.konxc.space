<script lang="ts">
	import { onMount } from 'svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import { marked } from 'marked';
	import { invalidateAll } from '$app/navigation';

	type MaterialType = 'text' | 'video' | 'link';

	interface Material {
		id: string;
		type: MaterialType;
		content: string | null;
		url: string | null;
		order: number;
		durationMs: number | null;
	}

	interface Props {
		material: Material;
		lessonId: string;
		courseId: string;
		onComplete?: () => void;
	}

	let { material, lessonId, courseId, onComplete }: Props = $props();

	let videoElement = $state<HTMLVideoElement | undefined>(undefined);
	let lastPosition = 0;
	let progressInterval: ReturnType<typeof setInterval> | null = null;
	let hasCompleted = $state(false);

	onMount(() => {
		return () => {
			if (progressInterval) {
				clearInterval(progressInterval);
			}
		};
	});

	async function saveProgress(position: number, completed: boolean = false) {
		try {
			const response = await fetch(`/dashboard/courses/${courseId}/learn/progress`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					lessonId,
					lastPositionMs: position,
					completed
				})
			});

			if (!response.ok) {
				console.error('Failed to save progress');
			} else if (completed) {
				hasCompleted = true;
				await invalidateAll();
				if (onComplete) onComplete();
			}
		} catch (error) {
			console.error('Error saving progress:', error);
		}
	}

	function handleVideoTimeUpdate() {
		if (!videoElement) return;

		const currentTime = Math.floor(videoElement.currentTime * 1000);
		lastPosition = currentTime;

		// Auto-save progress every 5 seconds
		if (!progressInterval) {
			progressInterval = setInterval(() => {
				saveProgress(lastPosition, false);
			}, 5000);
		}

		// Mark as complete when video ends
		if (videoElement.ended && !hasCompleted) {
			hasCompleted = true;
			if (progressInterval) {
				clearInterval(progressInterval);
			}
			saveProgress(0, true);
		}
	}

	function handleManualComplete() {
		saveProgress(0, true);
	}

	const markdownContent = $derived(
		material.type === 'text' && material.content ? marked.parse(material.content) : null
	);
</script>

<div class="material-viewer overflow-hidden">
	{#if material.type === 'text'}
		<div class="prose max-w-none text-gray-700 prose-slate dark:text-gray-300 dark:prose-invert">
			{@html markdownContent || material.content || 'No content available'}
		</div>

		<div class="mt-10 border-t border-gray-100 pt-8 dark:border-neutral-800">
			<button
				onclick={handleManualComplete}
				disabled={hasCompleted}
				class={`inline-flex items-center gap-2 ${RADIUS.button} px-6 py-3 font-semibold transition-all ${
					hasCompleted
						? 'cursor-default bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
						: `${COLOR.accentBg} text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl`
				}`}
			>
				{#if hasCompleted}
					<span>✅ Sudah Selesai</span>
				{:else}
					<span>Lanjutkan & Tandai Selesai</span>
				{/if}
			</button>
		</div>
	{:else if material.type === 'video'}
		<div class="mb-8 overflow-hidden rounded-2xl shadow-2xl relative group">
			{#if material.url?.includes('youtube.com') || material.url?.includes('youtu.be')}
				{@const videoId = material.url?.includes('youtu.be')
					? material.url.split('/').pop()
					: material.url?.split('v=')[1]?.split('&')[0]}
				<div class="aspect-video w-full overflow-hidden bg-black">
					<iframe
						src="https://www.youtube.com/embed/{videoId}"
						width="100%"
						height="100%"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
						title="YouTube video player"
					></iframe>
				</div>
			{:else if material.url?.includes('vimeo.com')}
				{@const videoId = material.url?.split('/').pop()}
				<div class="aspect-video w-full overflow-hidden bg-black">
					<iframe
						src="https://player.vimeo.com/video/{videoId}"
						width="100%"
						height="100%"
						frameborder="0"
						allow="autoplay; fullscreen; picture-in-picture"
						allowfullscreen
						title="Vimeo video player"
					></iframe>
				</div>
			{:else}
				<video
					bind:this={videoElement}
					controls
					class="aspect-video w-full bg-black object-contain"
					ontimeupdate={handleVideoTimeUpdate}
					onerror={(e) => {
						// Fallback UI when video fails to load
						const parent = (e.target as HTMLElement).parentElement;
						if (parent) {
							parent.innerHTML = `
								<div class="aspect-video flex flex-col items-center justify-center bg-neutral-900 border-2 border-dashed border-neutral-700 rounded-2xl p-8 text-center">
									<div class="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
										<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
									</div>
									<h3 class="text-white font-bold text-xl mb-2">Video Tidak Tersedia</h3>
									<p class="text-neutral-400 max-w-sm mb-6">Maaf, tautan video ini nampaknya rusak atau telah dihapus oleh penyedia konten.</p>
									<a href="mailto:support@naikkelas.id?subject=Masalah Video: ${material.id}" class="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-colors font-medium">Laporkan Masalah</a>
								</div>
							`;
						}
					}}
				>
					<track kind="captions" src="" srclang="en" label="English" default />
					<source src={material.url || ''} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			{/if}
		</div>

		<div class="flex items-center justify-between gap-4">
			<p class={`${TEXT.body} ${COLOR.textMuted} text-sm italic`}>
				Selesaikan video untuk mencatat progres otomatis
			</p>
			<button
				onclick={handleManualComplete}
				disabled={hasCompleted}
				class={`inline-flex items-center gap-2 ${RADIUS.button} px-6 py-3 font-semibold transition-all ${
					hasCompleted
						? 'cursor-default bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
						: `${COLOR.accentBg} text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl`
				}`}
			>
				{#if hasCompleted}
					<span>✅ Sudah Selesai</span>
				{:else}
					<span>Tandai Selesai</span>
				{/if}
			</button>
		</div>
	{:else if material.type === 'link'}
		<div
			class="flex flex-col items-center justify-center rounded-2xl bg-gray-50 py-16 text-center dark:bg-neutral-900/50"
		>
			<div
				class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
			>
				<svg
					width="32"
					height="32"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
					<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
				</svg>
			</div>
			<h3 class={`${TEXT.h2} ${COLOR.textPrimary} mb-2`}>Sumber Belajar Eksternal</h3>
			<p class={`${TEXT.body} ${COLOR.textMuted} mb-8 max-w-md`}>
				Akses materi tambahan melalui tautan eksternal di bawah ini.
			</p>

			<div class="flex flex-wrap items-center justify-center gap-4">
				<a
					href={material.url || '#'}
					target="_blank"
					rel="noopener noreferrer"
					class={`inline-flex items-center gap-2 ${RADIUS.button} border-2 border-blue-600 px-8 py-4 font-bold text-blue-600 transition-all hover:bg-blue-50`}
				>
					Buka Tautan Materi
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
						<polyline points="15 3 21 3 21 9"></polyline>
						<line x1="10" y1="14" x2="21" y2="3"></line>
					</svg>
				</a>

				<button
					onclick={handleManualComplete}
					disabled={hasCompleted}
					class={`inline-flex items-center gap-2 ${RADIUS.button} px-8 py-4 font-bold transition-all ${
						hasCompleted
							? 'cursor-default bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
							: `${COLOR.accentBg} text-white shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40`
					}`}
				>
					{#if hasCompleted}
						<span>✅ Selesai Dilihat</span>
					{:else}
						<span>Saya Sudah Membaca Materi</span>
					{/if}
				</button>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Keep any specific necessary styles not covered by Tailwind */
	video {
		border-radius: 12px;
	}

	:global(.prose h1) {
		font-size: 1.875rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
	}
	:global(.prose h2) {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}
	:global(.prose p) {
		margin-bottom: 1.25rem;
		line-height: 1.75;
	}
	:global(.prose ul) {
		list-style-type: disc;
		padding-left: 1.5rem;
		margin-bottom: 1.25rem;
	}
	:global(.prose li) {
		margin-bottom: 0.5rem;
	}
</style>
