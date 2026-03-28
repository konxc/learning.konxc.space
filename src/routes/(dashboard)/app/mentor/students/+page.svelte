<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data }: { data: PageData } = $props();

	let selectedCourse = $state<string>(data.selectedCourse || 'all');

	const filtered = $derived(
		data.students.filter((s) => selectedCourse === 'all' || s.course.id === selectedCourse)
	);

	// Deduplicate students (a student can be in multiple courses)
	const uniqueStudentIds = $derived(new Set(filtered.map((s) => s.student.id)));
</script>

<svelte:head>
	<title>My Students — Mentor</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="My Students">
		{#if data.courses.length > 0}
			<select
				bind:value={selectedCourse}
				class={`cursor-pointer ${RADIUS.input} ${COLOR.cardBorder} ${SPACING.input} ${TEXT.button} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
			>
				<option value="all">All Courses</option>
				{#each data.courses as course}
					<option value={course.id}>{course.title}</option>
				{/each}
			</select>
		{/if}
	</PageHeader>

	{#if filtered.length === 0}
		<PageSection>
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<div class="mb-4 text-5xl">👨‍🎓</div>
				<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>No Students Yet</h3>
				<p class={`${COLOR.textSecondary} max-w-sm text-sm`}>
					Students who enroll in your courses will appear here.
				</p>
			</div>
		</PageSection>
	{:else}
		<!-- Summary Stats -->
		<div class="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
			<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5`}>
				<p class={`text-[10px] font-black uppercase tracking-widest ${COLOR.textMuted} mb-1`}>Total Students</p>
				<p class={`text-3xl font-black ${COLOR.textPrimary}`}>{uniqueStudentIds.size}</p>
			</div>
			<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5`}>
				<p class={`text-[10px] font-black uppercase tracking-widest ${COLOR.textMuted} mb-1`}>Enrollments</p>
				<p class="text-3xl font-black text-blue-600">{filtered.length}</p>
			</div>
			<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5 col-span-2 sm:col-span-1`}>
				<p class={`text-[10px] font-black uppercase tracking-widest ${COLOR.textMuted} mb-1`}>Completed</p>
				<p class="text-3xl font-black text-green-600">
					{filtered.filter((s) => s.status === 'completed' || s.completedAt).length}
				</p>
			</div>
		</div>

		<!-- Student Table -->
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} overflow-hidden`}>
			<div class="overflow-x-auto">
				<table class="w-full text-left">
					<thead>
						<tr class="border-b border-gray-100 bg-gray-50/70">
							<th class={`px-5 py-4 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>Student</th>
							<th class={`px-5 py-4 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted} hidden sm:table-cell`}>Course</th>
							<th class={`px-5 py-4 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted} hidden md:table-cell`}>Enrolled</th>
							<th class={`px-5 py-4 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>Status</th>
							<th class={`px-5 py-4 ${TEXT.small} font-black uppercase tracking-widest ${COLOR.textMuted}`}>Action</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-50">
						{#each filtered as s}
							<tr class="group hover:bg-blue-50/30 transition-colors duration-150">
								<!-- Student -->
								<td class="px-5 py-4">
									<div class="flex items-center gap-3">
										<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 text-sm font-black text-white shadow-sm">
											{(s.student.fullName || s.student.username)?.[0]?.toUpperCase() ?? 'S'}
										</div>
										<div>
											<p class={`font-semibold text-sm ${COLOR.textPrimary} leading-none`}>
												{s.student.fullName || s.student.username}
											</p>
											{#if s.student.email}
												<p class={`text-xs ${COLOR.textMuted} mt-0.5`}>{s.student.email}</p>
											{/if}
										</div>
									</div>
								</td>

								<!-- Course -->
								<td class="px-5 py-4 hidden sm:table-cell">
									<p class={`text-sm ${COLOR.textSecondary} max-w-[200px] truncate`}>{s.course.title}</p>
								</td>

								<!-- Enrolled -->
								<td class="px-5 py-4 hidden md:table-cell">
									<p class={`text-sm ${COLOR.textMuted}`}>
										{new Date(s.enrolledAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
									</p>
								</td>

								<!-- Status -->
								<td class="px-5 py-4">
									<span class={`inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
										s.status === 'active'
											? 'bg-green-100 text-green-700'
											: s.status === 'completed'
												? 'bg-blue-100 text-blue-700'
												: 'bg-amber-100 text-amber-700'
									}`}>
										{s.status}
									</span>
								</td>

								<!-- Action -->
								<td class="px-5 py-4">
									<a
										href="/app/mentor/students/{s.student.id}"
										class="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 no-underline transition-all hover:bg-blue-100 hover:shadow-sm"
									>
										View Progress
										<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
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
</PageWrapper>
