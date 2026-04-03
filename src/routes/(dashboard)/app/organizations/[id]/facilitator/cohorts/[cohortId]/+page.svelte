<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toast } from '$lib/stores/toastStore';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION, TABLE, STATUS } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date | string | null) {
		if (!date) return '-';
		return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(date));
	}

	const colorMap = {
		green: {
			bar: 'bg-emerald-500',
			badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
		},
		yellow: {
			bar: 'bg-amber-500',
			badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
		},
		red: {
			bar: 'bg-rose-500',
			badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
		}
	};

	let sendingReminder = $state<string | null>(null);

	const greenCount = $derived(data.students.filter((s) => s.color === 'green').length);
	const yellowCount = $derived(data.students.filter((s) => s.color === 'yellow').length);
	const redCount = $derived(data.students.filter((s) => s.color === 'red').length);
</script>

<svelte:head>
	<title>{data.cohort.name} — Facilitator</title>
</svelte:head>

<PageWrapper>
	<div class="mb-4">
		<a
			href="/app/organizations/{data.membership?.orgId}/facilitator/cohorts"
			class={`inline-flex items-center gap-1 text-sm font-semibold ${COLOR.accent} hover:underline`}
		>
			← Kembali ke Cohorts
		</a>
	</div>

	<PageHeader
		title={data.cohort.name}
		description={`Kursus: ${data.cohort.courseTitle} · ${data.students.length} siswa`}
	/>

	<!-- Summary Stats -->
	<div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
		<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-4 text-center`}>
			<p class="text-2xl font-black">{data.students.length}</p>
			<p class={`text-xs ${COLOR.textMuted}`}>Total Siswa</p>
		</div>
		<div
			class={`${RADIUS.card} border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800/50 dark:bg-emerald-950/20`}
		>
			<p class="text-2xl font-black text-emerald-700 dark:text-emerald-400">{greenCount}</p>
			<p class="text-xs text-emerald-600 dark:text-emerald-500">On Track (≥70%)</p>
		</div>
		<div
			class={`${RADIUS.card} border border-amber-200 bg-amber-50 p-4 text-center dark:border-amber-800/50 dark:bg-amber-950/20`}
		>
			<p class="text-2xl font-black text-amber-700 dark:text-amber-400">{yellowCount}</p>
			<p class="text-xs text-amber-600 dark:text-amber-500">Perlu Perhatian (30–70%)</p>
		</div>
		<div
			class={`${RADIUS.card} border border-rose-200 bg-rose-50 p-4 text-center dark:border-rose-800/50 dark:bg-rose-950/20`}
		>
			<p class="text-2xl font-black text-rose-700 dark:text-rose-400">{redCount}</p>
			<p class="text-xs text-rose-600 dark:text-rose-500">At Risk (&lt;30%)</p>
		</div>
	</div>

	<!-- Student Table -->
	<div
		class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} ${ELEVATION.card} overflow-hidden`}
	>
		<div class="overflow-x-auto">
			<table class="w-full text-left">
				<thead>
					<tr class={`${TABLE.thead} border-b ${TABLE.theadBorder}`}>
						<th
							class={`px-5 py-4 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
							>Siswa</th
						>
						<th
							class={`px-5 py-4 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
							>Progress</th
						>
						<th
							class={`px-5 py-4 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted} hidden sm:table-cell`}
							>Checkpoint</th
						>
						<th
							class={`px-5 py-4 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted} hidden md:table-cell`}
							>Bergabung</th
						>
						<th
							class={`px-5 py-4 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
							>Aksi</th
						>
					</tr>
				</thead>
				<tbody class={`${TABLE.divider} divide-y`}>
					{#each data.students as student}
						{@const colors = colorMap[student.color]}
						<tr class={`${TABLE.rowHover} transition-colors`}>
							<td class="px-5 py-4">
								<p class={`text-sm font-bold ${COLOR.textPrimary}`}>
									{student.fullName ?? student.username}
								</p>
								<p class={`text-xs ${COLOR.textMuted}`}>{student.email ?? student.username}</p>
							</td>
							<td class="px-5 py-4">
								<div class="flex items-center gap-3">
									<div class="h-2 w-32 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
										<div
											class={`h-full rounded-full ${colors.bar} transition-all duration-500`}
											style="width: {student.progressPct}%"
										></div>
									</div>
									<span class={`rounded-full px-2 py-0.5 text-xs font-bold ${colors.badge}`}>
										{student.progressPct}%
									</span>
								</div>
								<p class={`mt-1 text-xs ${COLOR.textMuted}`}>
									{student.completedLessons}/{student.totalLessons} pelajaran
								</p>
							</td>
							<td class="hidden px-5 py-4 sm:table-cell">
								<span class={`text-sm font-semibold ${COLOR.textPrimary}`}>
									{student.completedCheckpoints}/{student.totalCheckpoints}
								</span>
							</td>
							<td class="hidden px-5 py-4 md:table-cell">
								<span class={`text-xs ${COLOR.textMuted}`}>{formatDate(student.enrolledAt)}</span>
							</td>
							<td class="px-5 py-4">
								<form
									method="POST"
									action="?/sendReminder"
									use:enhance={() => {
										sendingReminder = student.userId;
										return async ({ result }) => {
											sendingReminder = null;
											if (result.type === 'success') {
												toast.success('Reminder terkirim!');
											} else {
												toast.error('Gagal mengirim reminder');
											}
										};
									}}
								>
									<input type="hidden" name="userId" value={student.userId} />
									<input type="hidden" name="cohortName" value={data.cohort.name} />
									<button
										type="submit"
										disabled={sendingReminder === student.userId}
										class={`inline-flex items-center gap-1 ${RADIUS.small} border ${STATUS.info.border} ${STATUS.info.bg} ${STATUS.info.text} px-3 py-1.5 text-xs font-bold ${TRANSITION.colors} hover:bg-blue-50 disabled:opacity-50`}
									>
										<Icon name="bell" size={12} />
										{sendingReminder === student.userId ? '...' : 'Reminder'}
									</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>

			{#if data.students.length === 0}
				<div class="py-16 text-center">
					<p class="mb-3 text-4xl">👥</p>
					<p class={`${TEXT.h4} ${COLOR.textPrimary}`}>Belum ada siswa</p>
					<p class={`text-sm ${COLOR.textMuted}`}>
						Siswa akan muncul setelah enrollment diaktifkan.
					</p>
				</div>
			{/if}
		</div>
	</div>
</PageWrapper>
