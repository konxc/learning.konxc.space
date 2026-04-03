<script lang="ts">
	import type { PageData } from './$types';
	import { COLOR, RADIUS } from '$lib/config/design';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date | string): string {
		return new Date(date).toLocaleString('id-ID', {
			day: '2-digit',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	const pendingSubmissions = $derived(
		data.submissions.filter((s) => s.type === 'assignment' && !s.gradeId)
	);
	const gradedSubmissions = $derived(data.submissions.filter((s) => s.gradeId));
</script>

<svelte:head>
	<title>Submissions - Naik Kelas</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h1 class={`text-2xl font-bold ${COLOR.textPrimary}`}>Submissions</h1>
		<p class={`mt-1 text-sm ${COLOR.textMuted}`}>Kelola submission dari siswa</p>
	</div>

	<!-- Pending Section -->
	{#if pendingSubmissions.length > 0}
		<div>
			<h2 class={`mb-4 text-lg font-semibold ${COLOR.textPrimary}`}>
				Pending ({pendingSubmissions.length})
			</h2>
			<div class="space-y-3">
				{#each pendingSubmissions as sub}
					<a
						href="/app/organizations/{data.membership?.orgId}/mentor/courses/{sub.courseId}/submissions?student={sub.userId}"
						class={`block rounded-xl border p-4 ${COLOR.card} ${COLOR.cardBorder} transition-all hover:border-blue-500/50`}
					>
						<div class="flex items-start justify-between">
							<div>
								<p class={`font-medium ${COLOR.textPrimary}`}>{sub.studentName}</p>
								<p class={`text-sm ${COLOR.textMuted}`}>{sub.courseTitle}</p>
								<p class={`mt-1 text-xs ${COLOR.textSecondary}`}>
									{sub.lessonTitle || 'Quiz'}
								</p>
							</div>
							<StatusBadge status="pending" />
						</div>
					</a>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Graded Section -->
	<div>
		<h2 class={`mb-4 text-lg font-semibold ${COLOR.textPrimary}`}>
			Graded ({gradedSubmissions.length})
		</h2>
		<div class="overflow-x-auto rounded-xl border">
			<table class="w-full text-sm">
				<thead>
					<tr class={`border-b ${COLOR.surface}`}>
						<th class={`px-4 py-3 text-left font-medium ${COLOR.textMuted}`}>Siswa</th>
						<th class={`px-4 py-3 text-left font-medium ${COLOR.textMuted}`}>Kursus</th>
						<th class={`px-4 py-3 text-left font-medium ${COLOR.textMuted}`}>Tipe</th>
						<th class={`px-4 py-3 text-right font-medium ${COLOR.textMuted}`}>Score</th>
						<th class={`px-4 py-3 text-left font-medium ${COLOR.textMuted}`}>Waktu</th>
					</tr>
				</thead>
				<tbody>
					{#each gradedSubmissions.slice(0, 20) as sub}
						<tr class={`border-b ${COLOR.cardBorder}`}>
							<td class={`px-4 py-3 ${COLOR.textPrimary}`}>{sub.studentName}</td>
							<td class={`px-4 py-3 ${COLOR.textSecondary}`}>{sub.courseTitle}</td>
							<td class="px-4 py-3">
								<span
									class={`rounded-full px-2 py-0.5 text-xs font-medium ${sub.type === 'quiz' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'}`}
								>
									{sub.type}
								</span>
							</td>
							<td class={`px-4 py-3 text-right font-medium ${COLOR.textPrimary}`}>
								{sub.gradeScore ?? sub.score ?? 0}
							</td>
							<td class={`px-4 py-3 ${COLOR.textMuted}`}>{formatDate(sub.createdAt)}</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class={`px-4 py-8 text-center ${COLOR.textMuted}`}>
								Belum ada submissions
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
