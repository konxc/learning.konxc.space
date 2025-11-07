<script lang="ts">
	import { onMount } from 'svelte';

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
	}

	let { material, lessonId, courseId }: Props = $props();

	let videoElement = $state<HTMLVideoElement | undefined>(undefined);
	let lastPosition = 0;
	let progressInterval: ReturnType<typeof setInterval> | null = null;
	let hasCompleted = false;

	onMount(() => {
		return () => {
			if (progressInterval) {
				clearInterval(progressInterval);
			}
		};
	});

	async function saveProgress(position: number, completed: boolean = false) {
		try {
			const response = await fetch(
				`/dashboard/courses/${courseId}/learn/progress`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						lessonId,
						lastPositionMs: position,
						completed
					})
				}
			);

			if (!response.ok) {
				console.error('Failed to save progress');
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
</script>

<div class="material-viewer">
	{#if material.type === 'text'}
		<div class="text-content">
			{@html material.content || 'No content available'}
		</div>
		<button onclick={handleManualComplete} class="complete-btn">Mark as Complete</button>
	{:else if material.type === 'video'}
		<div class="video-container">
			{#if material.url?.includes('youtube.com') || material.url?.includes('youtu.be')}
				{@const videoId = material.url?.includes('youtu.be')
					? material.url.split('/').pop()
					: material.url?.split('v=')[1]?.split('&')[0]}
				<div class="youtube-embed">
					<iframe
						src="https://www.youtube.com/embed/{videoId}"
						width="100%"
						height="500"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
						title="YouTube video player"
					></iframe>
				</div>
			{:else if material.url?.includes('vimeo.com')}
				{@const videoId = material.url?.split('/').pop()}
				<div class="vimeo-embed">
					<iframe
						src="https://player.vimeo.com/video/{videoId}"
						width="100%"
						height="500"
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
					width="100%"
					ontimeupdate={handleVideoTimeUpdate}
				>
					<track kind="captions" src="" srclang="en" label="English" default />
					<source src={material.url || ''} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			{/if}
		</div>
		<button onclick={handleManualComplete} class="complete-btn">Mark as Complete</button>
	{:else if material.type === 'link'}
		<div class="link-content">
			<h3>External Resource</h3>
			<p>Click the link below to access this resource:</p>
			<a href={material.url || '#'} target="_blank" rel="noopener noreferrer" class="external-link">
				{material.url || 'Link'}
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
					<path
						d="M10 3.33333H12.6667V6M9.33333 6.66667L13.3333 2.66667M12.6667 9.33333V12.6667C12.6667 13.0203 12.5262 13.3594 12.2761 13.6095C12.026 13.8595 11.687 14 11.3333 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V4.66667C2 4.31305 2.14048 3.97391 2.39052 3.72386C2.64057 3.47381 2.97971 3.33333 3.33333 3.33333H6.66667"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</a>
		</div>
		<button onclick={handleManualComplete} class="complete-btn">Mark as Complete</button>
	{/if}
</div>

<style>
	.material-viewer {
		background: white;
		border-radius: 12px;
		padding: 24px;
		margin-bottom: 20px;
	}

	.text-content {
		margin-bottom: 20px;
		line-height: 1.6;
		color: var(--color-primary-dark);
	}

	.video-container {
		margin-bottom: 20px;
	}

	.youtube-embed,
	.vimeo-embed {
		position: relative;
		width: 100%;
		padding-bottom: 56.25%; /* 16:9 aspect ratio */
		height: 0;
		overflow: hidden;
	}

	.youtube-embed iframe,
	.vimeo-embed iframe {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	video {
		border-radius: 8px;
		background: #000;
	}

	.link-content h3 {
		color: var(--color-primary-dark);
		margin-bottom: 8px;
	}

	.link-content p {
		color: var(--color-primary-medium);
		margin-bottom: 16px;
	}

	.external-link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 12px 20px;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start),
			var(--color-gradient-purple-end)
		);
		color: white;
		text-decoration: none;
		border-radius: 8px;
		font-weight: 600;
		transition: transform 0.2s ease;
	}

	.external-link:hover {
		transform: translateY(-2px);
	}

	.complete-btn {
		padding: 12px 24px;
		background: linear-gradient(
			135deg,
			var(--color-gradient-purple-start),
			var(--color-gradient-purple-end)
		);
		color: white;
		border: none;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.complete-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	}
</style>

