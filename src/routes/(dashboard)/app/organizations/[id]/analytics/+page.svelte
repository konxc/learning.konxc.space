<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import Icon from '$lib/components/ui/Icon.svelte';

	let { data }: { data: PageData } = $props();

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(date: Date | null) {
		if (!date) return '-';
		return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(date));
	}

	const completionRate = $derived(
		data.stats.totalEnrollments > 0
			? Math.round((data.stats.completedEnrollments / data.stats.totalEnrollments) * 100)
			: 0
	);

	const activeEnrollments = $derived(data.stats.totalEnrollments - data.stats.completedEnrollments);
</script>

<svelte:head>
	<title>Analytics - {data.organization.name} - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<!-- Header -->
	<div class="mb-8 flex items-start justify-between">
		<PageHeader title="Analytics" description={`Metrik performa untuk ${data.organization.name}`} />
		<a
			href="/app/organizations/{data.organization.id}"
			class={`${RADIUS.button} border ${COLOR.cardBorder} px-4 py-2 text-xs font-bold tracking-widest uppercase ${COLOR.textMuted} ${TRANSITION.all} hover:bg-zinc-50 dark:hover:bg-zinc-800`}
		>
			← Kembali ke Organisasi
		</a>
	</div>

	<!-- Key Stats -->
	<div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-5 ${ELEVATION.card}`}>
			<div class="mb-2 flex items-center gap-2">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30"
				>
					<Icon name="book-open" size={16} />
				</div>
				<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}>Kursus</p>
			</div>
			<p class={`text-3xl font-black tracking-tight ${COLOR.textPrimary}`}>
				{data.stats.totalCourses}
			</p>
			<p class={`text-xs ${COLOR.textMuted}`}>
				{data.stats.publishedCourses} dipublikasikan
			</p>
		</div>

		<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-5 ${ELEVATION.card}`}>
			<div class="mb-2 flex items-center gap-2">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30"
				>
					<Icon name="users" size={16} />
				</div>
				<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}>Anggota</p>
			</div>
			<p class={`text-3xl font-black tracking-tight ${COLOR.textPrimary}`}>
				{data.stats.memberCount}
			</p>
			<div class="mt-1 flex flex-wrap gap-1">
				{#each Object.entries(data.stats.membersByRole) as [role, count]}
					<span
						class="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500 capitalize dark:bg-zinc-800"
					>
						{count}
						{role}
					</span>
				{/each}
			</div>
		</div>

		<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-5 ${ELEVATION.card}`}>
			<div class="mb-2 flex items-center gap-2">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30"
				>
					<Icon name="check-circle" size={16} />
				</div>
				<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}>Pendaftaran</p>
			</div>
			<p class={`text-3xl font-black tracking-tight ${COLOR.textPrimary}`}>
				{data.stats.totalEnrollments}
			</p>
			<p class={`text-xs ${COLOR.textMuted}`}>
				{activeEnrollments} aktif, {data.stats.completedEnrollments} selesai
			</p>
		</div>

		<div class={`${RADIUS.card} ${COLOR.card} border ${COLOR.cardBorder} p-5 ${ELEVATION.card}`}>
			<div class="mb-2 flex items-center gap-2">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
				>
					<Icon name="dollar-sign" size={16} />
				</div>
				<p class={`text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}>Pendapatan</p>
			</div>
			<p class="text-2xl font-black tracking-tight text-emerald-600">
				{formatCurrency(data.stats.revenue)}
			</p>
			<p class={`text-xs ${COLOR.textMuted}`}>Total dari transaksi berhasil</p>
		</div>
	</div>

	<!-- Pending Actions -->
	{#if data.stats.pendingReviews > 0 || data.stats.pendingSubmissions > 0}
		<div class="mb-8">
			<div
				class={`${RADIUS.card} border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-900/50 dark:bg-amber-950/20`}
			>
				<div class="mb-3 flex items-center gap-2">
					<Icon name="alert-circle" size={18} class="text-amber-600" />
					<p class="text-sm font-bold text-amber-800 dark:text-amber-300">Tindakan Diperlukan</p>
				</div>
				<div class="flex flex-wrap gap-3">
					{#if data.stats.pendingSubmissions > 0}
						<a
							href="/app/mentor/courses"
							class="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-amber-800 shadow-sm hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-200"
						>
							<span class="font-bold">{data.stats.pendingSubmissions}</span> tugas menunggu penilaian
						</a>
					{/if}
					{#if data.stats.pendingReviews > 0}
						<a
							href="/app/admin/reviews"
							class="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-amber-800 shadow-sm hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-200"
						>
							<span class="font-bold">{data.stats.pendingReviews}</span> review menunggu moderasi
						</a>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Completion Rate -->
	<div class="mb-8">
		<PageSection>
			<div class="mb-6 flex items-center justify-between">
				<div>
					<h2 class={`${TEXT.h3} ${COLOR.textPrimary}`}>Tingkat Penyelesaian</h2>
					<p class={`text-xs ${COLOR.textMuted}`}>Rata-rata seluruh kursus</p>
				</div>
				<span class="text-4xl font-black text-blue-600">{completionRate}%</span>
			</div>
			<div class="h-6 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
				<div
					class="h-full rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-green-500 transition-all duration-1000"
					style="width: {completionRate}%"
				></div>
			</div>
			<div class="mt-3 flex items-center justify-between text-xs text-zinc-400">
				<span>{data.stats.completedEnrollments} selesai</span>
				<span>{data.stats.totalEnrollments} total pendaftaran</span>
			</div>
		</PageSection>
	</div>

	<!-- Courses Detail -->
	<div class="mb-8">
		<PageSection>
			<h2 class={`${TEXT.h3} ${COLOR.textPrimary} mb-6`}>Detail Kursus ({data.courses.length})</h2>

			{#if data.courses.length === 0}
				<div class="py-10 text-center">
					<Icon name="book-open" size={32} class="mx-auto mb-3 text-zinc-300" />
					<p class={`${COLOR.textMuted}`}>Belum ada kursus di organisasi ini</p>
					<a
						href="/app/mentor/courses"
						class={`mt-4 inline-block ${RADIUS.button} ${COLOR.accentBg} px-4 py-2 text-xs font-bold text-white`}
					>
						Buat Kursus Pertama
					</a>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-left">
						<thead>
							<tr class="border-b border-zinc-100 dark:border-zinc-800">
								<th
									class={`px-4 py-3 text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}
									>Kursus</th
								>
								<th
									class={`px-4 py-3 text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}
									>Status</th
								>
								<th
									class={`px-4 py-3 text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}
									>Pendaftaran</th
								>
								<th
									class={`px-4 py-3 text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}
									>Penyelesaian</th
								>
								<th
									class={`px-4 py-3 text-xs font-bold tracking-widest uppercase ${COLOR.textMuted}`}
									>Harga</th
								>
							</tr>
						</thead>
						<tbody class="divide-y divide-zinc-50 dark:divide-zinc-800">
							{#each data.courses as course}
								<tr class="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
									<td class="px-4 py-4">
										<a
											href="/app/explore/{course.id}"
											class={`font-medium ${COLOR.textPrimary} hover:${COLOR.accent}`}
										>
											{course.title}
										</a>
									</td>
									<td class="px-4 py-4">
										<span
											class={`rounded-full px-2 py-0.5 text-xs font-bold ${
												course.status === 'published'
													? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
													: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
											}`}
										>
											{course.status}
										</span>
									</td>
									<td class={`px-4 py-4 font-bold ${COLOR.textPrimary}`}>{course.enrollments}</td>
									<td class="px-4 py-4">
										<div class="flex items-center gap-2">
											<div
												class="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
											>
												<div
													class="h-full rounded-full bg-blue-500"
													style="width: {course.enrollments > 0
														? (course.completions / course.enrollments) * 100
														: 0}%"
												></div>
											</div>
											<span class="text-xs text-zinc-500"
												>{course.completions}/{course.enrollments}</span
											>
										</div>
									</td>
									<td class={`px-4 py-4 text-sm ${COLOR.textSecondary}`}>
										{formatCurrency(course.price)}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</PageSection>
	</div>

	<!-- Recent Enrollments -->
	<div class="grid gap-8 lg:grid-cols-2">
		<PageSection>
			<h2 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>Pendaftaran Terbaru</h2>
			{#if data.recentEnrollments.length === 0}
				<p class={`py-4 text-center ${COLOR.textMuted}`}>Belum ada pendaftaran</p>
			{:else}
				<div class="space-y-3">
					{#each data.recentEnrollments as enrollment}
						<div
							class={`flex items-center justify-between rounded-xl border p-3 ${COLOR.cardBorder}`}
						>
							<div>
								<p class={`text-sm font-semibold ${COLOR.textPrimary}`}>
									{enrollment.user.fullName || enrollment.user.username}
								</p>
								<p class={`text-xs ${COLOR.textMuted}`}>{enrollment.course.title}</p>
							</div>
							<span class={`text-xs ${COLOR.textMuted}`}>
								{formatDate(enrollment.enrolledAt)}
							</span>
						</div>
					{/each}
				</div>
			{/if}
		</PageSection>

		<!-- Quick Stats Summary -->
		<PageSection>
			<h2 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>Ringkasan</h2>
			<div class="space-y-4">
				<div
					class="flex items-center justify-between rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50"
				>
					<div class="flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30"
						>
							<Icon name="calendar" size={18} class="text-blue-600" />
						</div>
						<span class={`text-sm font-medium ${COLOR.textPrimary}`}>Batch/Cohort</span>
					</div>
					<span class="text-xl font-black text-blue-600">{data.stats.cohortCount}</span>
				</div>

				<div
					class="flex items-center justify-between rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50"
				>
					<div class="flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30"
						>
							<Icon name="users" size={18} class="text-purple-600" />
						</div>
						<span class={`text-sm font-medium ${COLOR.textPrimary}`}>Member Aktif</span>
					</div>
					<span class="text-xl font-black text-purple-600">{data.stats.memberCount}</span>
				</div>

				<div
					class="flex items-center justify-between rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50"
				>
					<div class="flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30"
						>
							<Icon name="award" size={18} class="text-green-600" />
						</div>
						<span class={`text-sm font-medium ${COLOR.textPrimary}`}>Selesai Belajar</span>
					</div>
					<span class="text-xl font-black text-green-600">{data.stats.completedEnrollments}</span>
				</div>

				<div
					class="flex items-center justify-between rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50"
				>
					<div class="flex items-center gap-3">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30"
						>
							<Icon name="dollar-sign" size={18} class="text-emerald-600" />
						</div>
						<span class={`text-sm font-medium ${COLOR.textPrimary}`}>Total Revenue</span>
					</div>
					<span class="text-lg font-black text-emerald-600"
						>{formatCurrency(data.stats.revenue)}</span
					>
				</div>
			</div>
		</PageSection>
	</div>
</PageWrapper>
