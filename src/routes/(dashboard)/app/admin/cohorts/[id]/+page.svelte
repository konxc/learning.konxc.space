<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import StatCard from '$lib/components/ui/StatCard.svelte';
	import { COLOR, RADIUS, SPACING, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { toast } from '$lib/stores/toastStore';

	let { data, form }: { data: PageData; form?: ActionData | null } = $props();

	const cohortId = $page.params.id;

	const statusColors: Record<string, string> = {
		upcoming: 'bg-amber-100 text-amber-700',
		active: 'bg-green-100 text-green-700',
		completed: 'bg-gray-100 text-gray-600'
	};

	const trackLabels: Record<string, { label: string; icon: string; color: string }> = {
		creator: { label: 'Creator', icon: '🎥', color: 'bg-purple-100 text-purple-700' },
		seller: { label: 'Seller', icon: '🛒', color: 'bg-orange-100 text-orange-700' },
		affiliate: { label: 'Affiliate', icon: '🔗', color: 'bg-teal-100 text-teal-700' }
	};

	const statusBadgeColors: Record<string, string> = {
		pending: 'bg-amber-100 text-amber-700',
		active: 'bg-green-100 text-green-700',
		completed: 'bg-blue-100 text-blue-700'
	};
</script>

<svelte:head>
	<title>{data.cohort.name} — Cohort Details</title>
</svelte:head>

<PageWrapper>
	<PageHeader title={data.cohort.name}>
		<a
			href="/app/admin/cohorts"
			class={`inline-flex items-center gap-2 ${RADIUS.button} border ${COLOR.cardBorder} px-4 py-2 text-sm font-semibold ${COLOR.textSecondary} ${TRANSITION.all} hover:bg-gray-50`}
		>
			← Back to Batches
		</a>
	</PageHeader>

	<!-- Cohort Info & Stats -->
	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<!-- Cohort Details -->
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-6`}>
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>📅 Cohort Details</h3>
			<div class="space-y-3">
				<div>
					<p class={`text-xs font-black tracking-widest uppercase ${COLOR.textMuted}`}>Course</p>
					<p class={`font-semibold ${COLOR.textPrimary}`}>{data.cohort.course.title}</p>
				</div>
				<div>
					<p class={`text-xs font-black tracking-widest uppercase ${COLOR.textMuted}`}>Period</p>
					<p class={`text-sm ${COLOR.textSecondary}`}>
						{new Date(data.cohort.startDate).toLocaleDateString('id-ID', {
							day: 'numeric',
							month: 'long',
							year: 'numeric'
						})}
						{#if data.cohort.endDate}
							<span class="mx-1">→</span>
							{new Date(data.cohort.endDate).toLocaleDateString('id-ID', {
								day: 'numeric',
								month: 'long',
								year: 'numeric'
							})}
						{/if}
					</p>
				</div>
				<div>
					<p class={`text-xs font-black tracking-widest uppercase ${COLOR.textMuted}`}>Status</p>
					<span
						class={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase ${statusColors[data.cohort.status]}`}
					>
						{data.cohort.status}
					</span>
				</div>
				<div>
					<p class={`text-xs font-black tracking-widest uppercase ${COLOR.textMuted}`}>
						Facilitator
					</p>
					{#if data.cohort.facilitator}
						<p class={`text-sm ${COLOR.textPrimary}`}>
							{data.cohort.facilitator.fullName || 'No name'}
						</p>
						<p class={`text-xs ${COLOR.textMuted}`}>{data.cohort.facilitator.email}</p>
					{:else}
						<p class={`text-sm ${COLOR.textMuted}`}>Not assigned</p>
					{/if}
				</div>
			</div>

			<!-- Assign Facilitator Form -->
			<form
				method="POST"
				action="?/assignFacilitator"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'success') {
							toast.success('Facilitator assigned!');
						} else if (result.type === 'failure') {
							const errorMsg = (result.data as any)?.error || 'Failed to assign facilitator';
							toast.error(errorMsg);
						}
					};
				}}
				class="mt-6 space-y-3"
			>
				<div>
					<select
						name="facilitatorId"
						class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} ${SPACING.input} ${TEXT.body} outline-none ${TRANSITION.all} cursor-pointer focus:border-blue-600 focus:ring-2 focus:ring-blue-100`}
					>
						<option value="">-- Assign Facilitator --</option>
						{#each data.facilitators as facilitator}
							<option
								value={facilitator.id}
								selected={data.cohort.facilitator?.id === facilitator.id}
							>
								{facilitator.fullName || facilitator.email}
							</option>
						{/each}
					</select>
				</div>
				<button
					type="submit"
					class={`${RADIUS.button} ${COLOR.accentBg} w-full px-4 py-2 text-sm font-bold text-white ${TRANSITION.all} hover:-translate-y-0.5 hover:shadow-lg`}
				>
					Save Facilitator
				</button>
			</form>
		</div>

		<!-- Stats -->
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-6`}>
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>📊 Statistics</h3>
			<div class="grid grid-cols-2 gap-4">
				<StatCard value={data.stats.totalStudents} label="Total" variant="accent" />
				<StatCard value={data.stats.activeStudents} label="Active" variant="success" />
				<StatCard value={data.stats.pendingStudents} label="Pending" variant="warning" />
				<StatCard value={data.stats.completedStudents} label="Completed" variant="purple" />
			</div>

			<!-- Track Distribution -->
			<div class="mt-6">
				<p class={`text-xs font-black tracking-widest uppercase ${COLOR.textMuted} mb-3`}>
					Track Distribution
				</p>
				<div class="flex flex-wrap gap-2">
					{#if data.stats.tracks.creator > 0}
						<span class="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
							🎥 Creator: {data.stats.tracks.creator}
						</span>
					{/if}
					{#if data.stats.tracks.seller > 0}
						<span class="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
							🛒 Seller: {data.stats.tracks.seller}
						</span>
					{/if}
					{#if data.stats.tracks.affiliate > 0}
						<span class="rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-700">
							🔗 Affiliate: {data.stats.tracks.affiliate}
						</span>
					{/if}
					{#if data.stats.tracks.unassigned > 0}
						<span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
							❓ Unassigned: {data.stats.tracks.unassigned}
						</span>
					{/if}
				</div>
			</div>
		</div>

		<!-- Quick Actions -->
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-6`}>
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>⚡ Quick Actions</h3>
			<div class="space-y-3">
				<form method="POST" action="?/updateStatus">
					<input type="hidden" name="cohortId" value={cohortId} />
					<input
						type="hidden"
						name="status"
						value={data.cohort.status === 'active' ? 'completed' : 'active'}
					/>
					<button
						type="submit"
						class={`${RADIUS.button} w-full px-4 py-2.5 text-sm font-bold ${TRANSITION.all} ${
							data.cohort.status === 'active'
								? 'border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
								: 'bg-green-600 text-white hover:bg-green-700'
						}`}
					>
						{data.cohort.status === 'active' ? 'Mark as Completed' : 'Mark as Active'}
					</button>
				</form>
			</div>
		</div>
	</div>

	<!-- Student List -->
	<div
		class={`mt-8 ${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} overflow-hidden`}
	>
		<div class="border-b border-gray-100 bg-gray-50/70 px-6 py-4">
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary}`}>👥 Students ({data.enrollments.length})</h3>
		</div>

		{#if data.enrollments.length === 0}
			<div class="flex flex-col items-center justify-center py-12 text-center">
				<div class="mb-3 text-4xl">📭</div>
				<p class={`${COLOR.textSecondary}`}>No students enrolled in this batch yet.</p>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full text-left">
					<thead>
						<tr class="border-b border-gray-100">
							<th
								class={`px-6 py-3 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
								>Student</th
							>
							<th
								class={`px-6 py-3 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
								>Track</th
							>
							<th
								class={`px-6 py-3 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
								>Status</th
							>
							<th
								class={`px-6 py-3 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
								>Enrolled</th
							>
							<th
								class={`px-6 py-3 ${TEXT.small} font-black tracking-widest uppercase ${COLOR.textMuted}`}
								>Actions</th
							>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-50">
						{#each data.enrollments as enrollment}
							<tr class="transition-colors hover:bg-blue-50/20">
								<td class="px-6 py-4">
									<p class={`font-semibold ${COLOR.textPrimary}`}>
										{enrollment.user.fullName || enrollment.user.username}
									</p>
									<p class={`text-xs ${COLOR.textMuted}`}>{enrollment.user.email}</p>
								</td>
								<td class="px-6 py-4">
									{#if enrollment.track && trackLabels[enrollment.track]}
										<span
											class={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${trackLabels[enrollment.track].color}`}
										>
											{trackLabels[enrollment.track].icon}
											{trackLabels[enrollment.track].label}
										</span>
									{:else}
										<span class="text-xs text-gray-400">Not set</span>
									{/if}
								</td>
								<td class="px-6 py-4">
									<span
										class={`inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase ${statusBadgeColors[enrollment.status] || 'bg-gray-100 text-gray-600'}`}
									>
										{enrollment.status}
									</span>
								</td>
								<td class="px-6 py-4">
									<p class={`text-sm ${COLOR.textSecondary}`}>
										{new Date(enrollment.enrolledAt).toLocaleDateString('id-ID', {
											day: 'numeric',
											month: 'short',
											year: 'numeric'
										})}
									</p>
								</td>
								<td class="px-6 py-4">
									<div class="flex items-center gap-2">
										<a
											href="/app/mentor/students/{enrollment.user.id}"
											class="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition-all hover:bg-blue-100"
										>
											View
										</a>
										<form method="POST" action="?/removeStudent">
											<input type="hidden" name="enrollmentId" value={enrollment.id} />
											<button
												type="submit"
												class="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100"
												onclick={(e) => {
													if (!confirm('Remove this student from the batch?')) e.preventDefault();
												}}
											>
												Remove
											</button>
										</form>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</PageWrapper>
