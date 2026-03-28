<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import { COLOR, RADIUS, SPACING, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form?: ActionData | null } = $props();

	let exporting = $state(false);
	let generatingSummary = $state(false);
	let summaryResult = $state<any>(null);

	const periodOptions = [
		{ value: 'week', label: 'Last 7 Days' },
		{ value: 'month', label: 'Last 30 Days' },
		{ value: 'quarter', label: 'Last 90 Days' },
		{ value: 'all', label: 'All Time' }
	];
</script>

<svelte:head>
	<title>Reports — Admin</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="Reports & Analytics" />

	{#if form?.error}
		<div class="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
			⚠️ {form.error}
		</div>
	{/if}

	{#if form?.success}
		<div class="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-bold text-green-700 animate-in fade-in">
			✅ Export/Report generated successfully!
		</div>
	{/if}

	<!-- Overview Stats -->
	<div class="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5`}>
			<p class={`text-xs font-black uppercase tracking-widest ${COLOR.textMuted}`}>Total Students</p>
			<p class={`text-3xl font-black ${COLOR.textPrimary} mt-1`}>{data.stats.totalStudents}</p>
		</div>
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5`}>
			<p class={`text-xs font-black uppercase tracking-widest ${COLOR.textMuted}`}>Active</p>
			<p class="text-3xl font-black text-green-600 mt-1">{data.stats.activeStudents}</p>
		</div>
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5`}>
			<p class={`text-xs font-black uppercase tracking-widest ${COLOR.textMuted}`}>Completed</p>
			<p class="text-3xl font-black text-blue-600 mt-1">{data.stats.completedStudents}</p>
		</div>
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5`}>
			<p class={`text-xs font-black uppercase tracking-widest ${COLOR.textMuted}`}>Courses</p>
			<p class="text-3xl font-black text-purple-600 mt-1">{data.stats.totalCourses}</p>
		</div>
	</div>

	<!-- Track Distribution -->
	<div class="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5`}>
			<div class="flex items-center gap-3">
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">🎥</div>
				<div>
					<p class={`text-xs font-black uppercase tracking-widest ${COLOR.textMuted}`}>Content Creator</p>
					<p class="text-2xl font-black text-purple-600">{data.stats.byTrack.creator}</p>
				</div>
			</div>
		</div>
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5`}>
			<div class="flex items-center gap-3">
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">🛒</div>
				<div>
					<p class={`text-xs font-black uppercase tracking-widest ${COLOR.textMuted}`}>Seller</p>
					<p class="text-2xl font-black text-orange-600">{data.stats.byTrack.seller}</p>
				</div>
			</div>
		</div>
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5`}>
			<div class="flex items-center gap-3">
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-2xl">🔗</div>
				<div>
					<p class={`text-xs font-black uppercase tracking-widest ${COLOR.textMuted}`}>Affiliator</p>
					<p class="text-2xl font-black text-teal-600">{data.stats.byTrack.affiliate}</p>
				</div>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- Export Enrollments -->
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-6`}>
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>📥 Export Enrollments</h3>
			<form
				method="POST"
				action="?/exportEnrollments"
				use:enhance={() => {
					exporting = true;
					return async ({ update, result }) => {
						await update();
						exporting = false;
						
						if (result.type === 'success' && result.data && 'download' in result.data && (result.data as any).download) {
							const blob = new Blob([(result.data as any).content as string], { type: 'text/csv' });
							const url = URL.createObjectURL(blob);
							const a = document.createElement('a');
							a.href = url;
							a.download = (result.data as any).filename as string;
							a.click();
							URL.revokeObjectURL(url);
						}
					};
				}}
				class="space-y-4"
			>
				<div>
					<label for="format" class="mb-1.5 block text-xs font-black uppercase tracking-widest text-gray-500">
						Format
					</label>
					<select
						id="format"
						name="format"
						class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer`}
					>
						<option value="csv">CSV (Excel)</option>
					</select>
				</div>

				<div>
					<label for="courseId" class="mb-1.5 block text-xs font-black uppercase tracking-widest text-gray-500">
						Course (Optional)
					</label>
					<select
						id="courseId"
						name="courseId"
						class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer`}
					>
						<option value="">All Courses</option>
						{#each data.courses as course}
							<option value={course.id}>{course.title}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="cohortId" class="mb-1.5 block text-xs font-black uppercase tracking-widest text-gray-500">
						Cohort (Optional)
					</label>
					<select
						id="cohortId"
						name="cohortId"
						class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer`}
					>
						<option value="">All Cohorts</option>
						{#each data.cohorts as cohort}
							<option value={cohort.id}>{cohort.name}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="partnerId" class="mb-1.5 block text-xs font-black uppercase tracking-widest text-gray-500">
						Partner (Optional)
					</label>
					<select
						id="partnerId"
						name="partnerId"
						class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer`}
					>
						<option value="">All Partners</option>
						{#each data.partners as partner}
							<option value={partner.id}>{partner.name}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="status" class="mb-1.5 block text-xs font-black uppercase tracking-widest text-gray-500">
						Status (Optional)
					</label>
					<select
						id="status"
						name="status"
						class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer`}
					>
						<option value="">All Status</option>
						<option value="pending">Pending</option>
						<option value="active">Active</option>
						<option value="completed">Completed</option>
					</select>
				</div>

				<button
					type="submit"
					disabled={exporting}
					class={`${RADIUS.button} ${COLOR.accentBg} w-full px-5 py-3 text-sm font-bold text-white ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50`}
				>
					{exporting ? 'Exporting...' : 'Download CSV'}
				</button>
			</form>
		</div>

		<!-- Generate Summary Report -->
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-6`}>
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>📊 Summary Report</h3>
			<form
				method="POST"
				action="?/generateSummary"
				use:enhance={() => {
					generatingSummary = true;
					summaryResult = null;
					return async ({ update }) => {
						await update();
						generatingSummary = false;
					};
				}}
				class="space-y-4"
			>
				<div>
					<label for="period" class="mb-1.5 block text-xs font-black uppercase tracking-widest text-gray-500">
						Period
					</label>
					<select
						id="period"
						name="period"
						class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer`}
					>
						{#each periodOptions as opt}
							<option value={opt.value}>{opt.label}</option>
						{/each}
					</select>
				</div>

				<button
					type="submit"
					disabled={generatingSummary}
					class={`${RADIUS.button} ${COLOR.accentBg} w-full px-5 py-3 text-sm font-bold text-white ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50`}
				>
					{generatingSummary ? 'Generating...' : 'Generate Report'}
				</button>
			</form>

			{#if form?.success && form?.summary}
				{@const s = form.summary}
				<div class="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
					<h4 class="font-bold text-blue-800 mb-3">Summary: {s.period === 'week' ? 'Last 7 Days' : s.period === 'month' ? 'Last 30 Days' : s.period === 'quarter' ? 'Last 90 Days' : 'All Time'}</h4>
					<div class="grid grid-cols-2 gap-3 text-sm">
						<div>
							<span class="text-gray-500">New Enrollments:</span>
							<span class="ml-2 font-bold text-blue-700">{s.newEnrollments}</span>
						</div>
						<div>
							<span class="text-gray-500">Active:</span>
							<span class="ml-2 font-bold text-green-700">{s.activeEnrollments}</span>
						</div>
						<div>
							<span class="text-gray-500">Completed:</span>
							<span class="ml-2 font-bold text-purple-700">{s.completedEnrollments}</span>
						</div>
						<div class="col-span-2 mt-2 pt-2 border-t border-blue-200">
							<span class="text-gray-500 text-xs uppercase tracking-widest">Tracks:</span>
							<div class="flex gap-3 mt-1">
								<span class="text-purple-600">🎥 {s.tracks.creator}</span>
								<span class="text-orange-600">🛒 {s.tracks.seller}</span>
								<span class="text-teal-600">🔗 {s.tracks.affiliate}</span>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</PageWrapper>
