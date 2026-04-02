<script lang="ts">
	import { COLOR, RADIUS, ELEVATION, TRANSITION, TEXT, SPACING } from '$lib/config/design';

	interface Props {
		lessonId: string;
		courseId: string;
		currentTimeMs?: number;
	}

	let { lessonId, courseId, currentTimeMs = 0 }: Props = $props();

	let content = $state('');
	let isOpen = $state(false);
	let isSaving = $state(false);
	let textareaEl = $state<HTMLTextAreaElement | null>(null);

	// Load existing note on mount
	$effect(() => {
		if (!lessonId || !courseId) return;
		fetch(`/api/notes?lessonId=${lessonId}&courseId=${courseId}`)
			.then((r) => r.json())
			.then((data) => {
				if (data.note?.content) content = data.note.content;
			})
			.catch(() => {});
	});

	// Auto-resize textarea
	$effect(() => {
		if (textareaEl && content !== undefined) {
			textareaEl.style.height = 'auto';
			textareaEl.style.height = textareaEl.scrollHeight + 'px';
		}
	});

	// Debounce auto-save
	let saveTimer: ReturnType<typeof setTimeout> | null = null;

	function scheduleAutoSave() {
		if (saveTimer) clearTimeout(saveTimer);
		saveTimer = setTimeout(async () => {
			if (!content.trim()) return;
			isSaving = true;
			try {
				await fetch('/api/notes', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ lessonId, courseId, content })
				});
			} catch {
				// Silently fail
			} finally {
				isSaving = false;
			}
		}, 1000);
	}

	function insertTimestamp() {
		if (!textareaEl) return;
		const totalSec = Math.floor(currentTimeMs / 1000);
		const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
		const ss = String(totalSec % 60).padStart(2, '0');
		const stamp = `[${mm}:${ss}] `;

		const start = textareaEl.selectionStart;
		const end = textareaEl.selectionEnd;
		content = content.slice(0, start) + stamp + content.slice(end);

		// Restore cursor after stamp
		setTimeout(() => {
			if (!textareaEl) return;
			const pos = start + stamp.length;
			textareaEl.setSelectionRange(pos, pos);
			textareaEl.focus();
		}, 0);
	}

	function exportNotes() {
		const blob = new Blob([content], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `notes-${lessonId}.txt`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<!-- Toggle button -->
<button
	onclick={() => (isOpen = !isOpen)}
	class={`flex items-center gap-2 px-4 py-2 ${RADIUS.button} ${COLOR.card} ${COLOR.cardBorder} border ${TEXT.button} ${COLOR.textSecondary} ${TRANSITION.colors} hover:border-blue-500/50 hover:text-blue-600`}
	aria-label={isOpen ? 'Tutup catatan' : 'Buka catatan'}
	aria-expanded={isOpen}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
		<polyline points="14 2 14 8 20 8"></polyline>
		<line x1="16" y1="13" x2="8" y2="13"></line>
		<line x1="16" y1="17" x2="8" y2="17"></line>
		<polyline points="10 9 9 9 8 9"></polyline>
	</svg>
	Catatan
	{#if isSaving}
		<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500"></span>
	{/if}
</button>

<!-- Slide panel -->
{#if isOpen}
	<div
		class={`mt-2 overflow-hidden ${RADIUS.card} ${COLOR.card} ${COLOR.cardBorder} border ${ELEVATION.card} transition-all duration-300`}
	>
		<!-- Panel header -->
		<div class={`flex items-center justify-between border-b px-4 py-3 ${COLOR.cardBorder}`}>
			<span class={`${TEXT.small} ${COLOR.textMuted} font-semibold`}>Catatan Pelajaran</span>
			<div class="flex items-center gap-2">
				<!-- Timestamp button -->
				<button
					onclick={insertTimestamp}
					class={`px-2 py-1 text-xs font-semibold ${RADIUS.small} ${COLOR.neutral} ${COLOR.textSecondary} ${TRANSITION.colors} hover:bg-zinc-200 dark:hover:bg-zinc-700`}
					aria-label="Sisipkan timestamp saat ini"
					title="Sisipkan timestamp"
				>
					⏱ Timestamp
				</button>
				<!-- Export button -->
				<button
					onclick={exportNotes}
					disabled={!content.trim()}
					class={`px-2 py-1 text-xs font-semibold ${RADIUS.small} ${COLOR.neutral} ${COLOR.textSecondary} ${TRANSITION.colors} hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-zinc-700`}
					aria-label="Unduh catatan sebagai file teks"
					title="Unduh catatan"
				>
					⬇ Export
				</button>
			</div>
		</div>

		<!-- Textarea -->
		<div class="p-4">
			<textarea
				bind:this={textareaEl}
				bind:value={content}
				oninput={scheduleAutoSave}
				rows="5"
				placeholder="Tulis catatan kamu di sini... Gunakan tombol Timestamp untuk menandai momen penting."
				class={`w-full resize-none overflow-hidden ${RADIUS.input} border ${COLOR.cardBorder} bg-zinc-50 px-4 py-3 text-sm ${COLOR.textPrimary} outline-none placeholder:text-zinc-400 ${TRANSITION.colors} focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:bg-zinc-800/50`}
				aria-label="Area catatan pelajaran"
			></textarea>
			{#if isSaving}
				<p class="mt-1 text-right text-xs text-amber-500">Menyimpan...</p>
			{/if}
		</div>
	</div>
{/if}
