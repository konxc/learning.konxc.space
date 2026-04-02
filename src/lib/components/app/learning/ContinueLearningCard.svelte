<script lang="ts">
	import { COLOR, RADIUS, ELEVATION, TRANSITION, TEXT } from '$lib/config/design';

	interface LastLesson {
		lessonId: string;
		courseId: string;
		courseTitle: string;
		lessonTitle: string;
		lastPositionMs: number | null;
	}

	interface Props {
		lastLesson: LastLesson | null;
	}

	let { lastLesson }: Props = $props();

	function formatPosition(ms: number | null): string {
		if (!ms) return '0:00';
		const totalSec = Math.floor(ms / 1000);
		const m = Math.floor(totalSec / 60);
		const s = totalSec % 60;
		return `${m}:${String(s).padStart(2, '0')}`;
	}
</script>

{#if lastLesson}
	<a
		href="/app/learning/courses/{lastLesson.courseId}/lessons/{lastLesson.lessonId}"
		class={`group flex items-center gap-4 p-5 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} border ${ELEVATION.card} ${TRANSITION.all} hover:-translate-y-0.5 hover:border-blue-500/40`}
		aria-label="Lanjutkan belajar: {lastLesson.courseTitle}"
	>
		<!-- Icon -->
		<div
			class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<polygon points="5 3 19 12 5 21 5 3"></polygon>
			</svg>
		</div>

		<!-- Content -->
		<div class="min-w-0 flex-1">
			<p class={`${TEXT.small} mb-0.5 text-blue-600`}>Lanjutkan Belajar</p>
			<p class={`${TEXT.h4} ${COLOR.textPrimary} truncate`}>{lastLesson.courseTitle}</p>
			<p class={`text-sm ${COLOR.textMuted} truncate`}>{lastLesson.lessonTitle}</p>

			{#if lastLesson.lastPositionMs}
				<div class="mt-2 flex items-center gap-2">
					<span class="text-xs text-zinc-400"
						>Posisi: {formatPosition(lastLesson.lastPositionMs)}</span
					>
					<div class="h-1 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
						<div class="h-full rounded-full bg-blue-500" style="width: 40%"></div>
					</div>
				</div>
			{/if}
		</div>

		<!-- Arrow -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class={`shrink-0 ${COLOR.textMuted} ${TRANSITION.all} group-hover:translate-x-1 group-hover:text-blue-600`}
			aria-hidden="true"
		>
			<line x1="5" y1="12" x2="19" y2="12"></line>
			<polyline points="12 5 19 12 12 19"></polyline>
		</svg>
	</a>
{:else}
	<a
		href="/app/learning"
		class={`group flex items-center gap-4 p-5 ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} border ${ELEVATION.card} ${TRANSITION.all} hover:-translate-y-0.5 hover:border-blue-500/40`}
		aria-label="Mulai belajar"
	>
		<div
			class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
				<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
			</svg>
		</div>

		<div class="min-w-0 flex-1">
			<p class={`${TEXT.small} mb-0.5 text-emerald-600`}>Siap Belajar?</p>
			<p class={`${TEXT.h4} ${COLOR.textPrimary}`}>Mulai Belajar</p>
			<p class={`text-sm ${COLOR.textMuted}`}>Jelajahi kursus yang tersedia</p>
		</div>

		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class={`shrink-0 ${COLOR.textMuted} ${TRANSITION.all} group-hover:translate-x-1 group-hover:text-emerald-600`}
			aria-hidden="true"
		>
			<line x1="5" y1="12" x2="19" y2="12"></line>
			<polyline points="12 5 19 12 12 19"></polyline>
		</svg>
	</a>
{/if}
