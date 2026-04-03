<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let { data }: { data: PageData } = $props();

	function updateFilters(filters: { course?: string; cohort?: string; track?: string }) {
		const url = new URL(page.url);
		if (filters.course !== undefined) {
			if (filters.course === 'all') url.searchParams.delete('course');
			else url.searchParams.set('course', filters.course);
			// Reset cohort if course changes
			url.searchParams.delete('cohort');
		}
		if (filters.cohort !== undefined) {
			if (filters.cohort === 'all') url.searchParams.delete('cohort');
			else url.searchParams.set('cohort', filters.cohort);
		}
		if (filters.track !== undefined) {
			if (filters.track === 'all') url.searchParams.delete('track');
			else url.searchParams.set('track', filters.track);
		}
		goto(url.pathname + url.search);
	}

	// Deduplicate students (a student can be in multiple courses)
	const uniqueStudentIds = $derived(new Set(data.students.map((s) => s.student.id)));

	const trackLabels: Record<string, { label: string; color: string; icon: string }> = {
		creator: { label: 'Creator', color: 'bg-purple-100 text-purple-700', icon: '🎥' },
		seller: { label: 'Seller', color: 'bg-orange-100 text-orange-700', icon: '🛒' },
		affiliate: { label: 'Affiliate', color: 'bg-blue-100 text-blue-700', icon: '🔗' }
	};
</script>

<svelte:head>
	<title>My Students — Mentor</title>
</svelte:head>

<PageWrapper>
	<div class={`${SPACING.page} pb-12`}>
		<PageHeader title="My Students" />

		{#if data.students.length === 0}
			<div class="flex flex-col items-center justify-center py-24 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
				<div class="mb-6 rounded-3xl bg-zinc-50 p-8 dark:bg-white/2 text-8xl">👨‍🎓</div>
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>No Students Found</h3>
				<p class={`${COLOR.textSecondary} max-w-sm text-sm opacity-70`}>
					Try adjusting your filters or wait for students to enroll in your courses.
				</p>
			</div>
		{:else}
			<!-- Summary Stats -->
			<div class="mb-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
				<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-6 shadow-xl shadow-zinc-500/5`}>
					<p class={`text-[10px] font-black tracking-widest uppercase ${COLOR.textMuted} mb-2`}>
						Filtered Students
					</p>
					<div class="flex items-baseline gap-1.5">
						<span class={`text-4xl font-black ${COLOR.textPrimary}`}>{uniqueStudentIds.size}</span>
						<span class="text-sm font-bold text-gray-400">Total</span>
					</div>
				</div>
				<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-6 shadow-xl shadow-zinc-500/5`}>
					<p class={`text-[10px] font-black tracking-widest uppercase ${COLOR.textMuted} mb-2`}>
						Total Enrollments
					</p>
					<div class="flex items-baseline gap-1.5">
						<span class="text-4xl font-black text-blue-600">{data.students.length}</span>
						<span class="text-sm font-bold text-gray-400">Records</span>
					</div>
				</div>
				<div
					class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} col-span-2 p-6 sm:col-span-1 shadow-xl shadow-zinc-500/5`}
				>
					<p class={`text-[10px] font-black tracking-widest uppercase ${COLOR.textMuted} mb-2`}>
						Active Programs
					</p>
					<div class="flex items-baseline gap-1.5">
						<span class="text-4xl font-black text-green-600">
							{data.students.filter((s) => s.status === 'active').length}
						</span>
						<span class="text-sm font-bold text-gray-400">Active</span>
					</div>
				</div>
			</div>

			<!-- Filters Bar (Above Table) -->
			<div class="mb-6 flex flex-wrap items-center justify-between gap-4">
				<h4 class={`${TEXT.h4} ${COLOR.textPrimary} hidden md:block`}>All Students</h4>
				
				<div class="flex flex-wrap items-center gap-4">
					{#if data.courses.length > 0}
						<div class="relative group">
							<select
								value={data.selectedCourse || 'all'}
								onchange={(e) => updateFilters({ course: (e.target as HTMLSelectElement).value })}
								class={`appearance-none cursor-pointer ${RADIUS.input} ${COLOR.cardBorder} border bg-white/50 pl-10 pr-10 py-2.5 text-xs font-black tracking-widest uppercase outline-none ${TRANSITION.all} focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:bg-zinc-900/50`}
							>
								<option value="all">All Courses</option>
								{#each data.courses as course}
									<option value={course.id}>{course.title}</option>
								{/each}
							</select>
							<span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs opacity-40">📖</span>
							<span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] opacity-40">▼</span>
						</div>
					{/if}

					{#if data.cohorts.length > 0}
						<div class="relative group">
							<select
								value={data.selectedCohort || 'all'}
								onchange={(e) => updateFilters({ cohort: (e.target as HTMLSelectElement).value })}
								class={`appearance-none cursor-pointer ${RADIUS.input} ${COLOR.cardBorder} border bg-white/50 pl-10 pr-10 py-2.5 text-xs font-black tracking-widest uppercase outline-none ${TRANSITION.all} focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:bg-zinc-900/50`}
							>
								<option value="all">All Batches</option>
								{#each data.cohorts as cohort}
									<option value={cohort.id}>{cohort.name}</option>
								{/each}
							</select>
							<span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs opacity-40">👥</span>
							<span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] opacity-40">▼</span>
						</div>
					{/if}

					<div class="relative group">
						<select
							value={data.selectedTrack || 'all'}
							onchange={(e) => updateFilters({ track: (e.target as HTMLSelectElement).value })}
							class={`appearance-none cursor-pointer ${RADIUS.input} ${COLOR.cardBorder} border bg-white/50 pl-10 pr-10 py-2.5 text-xs font-black tracking-widest uppercase outline-none ${TRANSITION.all} focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:bg-zinc-900/50`}
						>
							<option value="all">All Tracks</option>
							<option value="creator">🎥 Creator</option>
							<option value="seller">🛒 Seller</option>
							<option value="affiliate">🔗 Affiliate</option>
						</select>
						<span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs opacity-40">🎯</span>
						<span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] opacity-40">▼</span>
					</div>
				</div>
			</div>

		<!-- Student Table -->
		<div
			class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} overflow-hidden`}
		>
			<div class="overflow-x-auto">
				<table class="w-full text-left">
					<thead>
						<tr class="border-b border-gray-100 bg-gray-50/70">
							<th
								class={`px-5 py-4 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
								>Student</th
							>
							<th
								class={`px-5 py-4 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted} hidden md:table-cell`}
								>Course / Batch</th
							>
							<th
								class={`px-5 py-4 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted} hidden sm:table-cell`}
								>Track</th
							>
							<th
								class={`px-5 py-4 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
								>Status</th
							>
							<th
								class={`px-5 py-4 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
								>Action</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-50">
						{#each data.students as s}
							<tr class="group transition-colors duration-150 hover:bg-blue-50/30">
								<!-- Student -->
								<td class="px-5 py-4">
									<div class="flex items-center gap-3">
										<div
											class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-700 text-sm font-black text-white shadow-sm"
										>
											{(s.student.fullName || s.student.username)?.[0]?.toUpperCase() ?? 'S'}
										</div>
										<div>
											<p class={`text-sm font-semibold ${COLOR.textPrimary} leading-none`}>
												{s.student.fullName || s.student.username}
											</p>
											{#if s.student.email}
												<p class={`text-xs ${COLOR.textMuted} mt-0.5`}>{s.student.email}</p>
											{/if}
										</div>
									</div>
								</td>

								<!-- Course / Batch -->
								<td class="hidden px-5 py-4 md:table-cell">
									<p class={`text-sm font-medium ${COLOR.textPrimary} max-w-[200px] truncate`}>
										{s.course.title}
									</p>
									{#if s.cohort}
										<p class="mt-0.5 text-[10px] font-bold tracking-tight text-blue-600 uppercase">
											{s.cohort.name}
										</p>
									{:else}
										<p class="mt-0.5 text-[10px] font-bold tracking-tight text-gray-400 uppercase">
											No Batch
										</p>
									{/if}
								</td>

								<!-- Track -->
								<td class="hidden px-5 py-4 sm:table-cell">
									{#if s.track && trackLabels[s.track]}
										<span
											class={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-tight uppercase ${trackLabels[s.track].color}`}
										>
											<span class="text-xs">{trackLabels[s.track].icon}</span>
											{trackLabels[s.track].label}
										</span>
									{:else}
										<span
											class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-black tracking-tight text-gray-500 uppercase"
										>
											General
										</span>
									{/if}
								</td>

								<!-- Status -->
								<td class="px-5 py-4">
									<span
										class={`inline-block rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${
											s.status === 'active'
												? 'bg-green-100 text-green-700'
												: s.status === 'completed'
													? 'bg-blue-100 text-blue-700'
													: 'bg-amber-100 text-amber-700'
										}`}
									>
										{s.status}
									</span>
								</td>

								<!-- Action -->
								<td class="px-5 py-4 text-right sm:text-left">
									<a
										href="/app/organizations/{data.membership?.orgId}/mentor/students/{s.student.id}"
										class="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 no-underline transition-all hover:bg-blue-100 hover:shadow-sm"
									>
										Monitor
										<svg
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2.5"
										>
											<line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
										</svg>
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
	</div>
</PageWrapper>
