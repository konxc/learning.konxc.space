<script lang="ts">
	import type { PageData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();

	const trackLabels: Record<string, { label: string; icon: string; color: string }> = {
		creator: { label: 'Creator', icon: '🎥', color: 'bg-purple-100 text-purple-700' },
		seller: { label: 'Seller', icon: '🛒', color: 'bg-orange-100 text-orange-700' },
		affiliate: { label: 'Affiliate', icon: '🔗', color: 'bg-teal-100 text-teal-700' }
	};

	let submitting = $state<string | null>(null);
	let expandedCheckpoint = $state<string | null>(null);

	function isOverdue(dueDate: Date | null): boolean {
		if (!dueDate) return false;
		return new Date(dueDate) < new Date();
	}
</script>

<svelte:head>
	<title>Weekly Checkpoints — Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="Weekly Checkpoints" description="Complete your weekly action items to track your progress" />

	<!-- Stats -->
	<div class="mb-8 grid grid-cols-3 gap-4">
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5 text-center`}>
			<p class="text-3xl font-black text-blue-600">{data.stats.total}</p>
			<p class={`text-xs font-bold uppercase tracking-widest ${COLOR.textMuted}`}>Total</p>
		</div>
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5 text-center`}>
			<p class="text-3xl font-black text-green-600">{data.stats.completed}</p>
			<p class={`text-xs font-bold uppercase tracking-widest ${COLOR.textMuted}`}>Completed</p>
		</div>
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-5 text-center`}>
			<p class="text-3xl font-black text-amber-500">{data.stats.pending}</p>
			<p class={`text-xs font-bold uppercase tracking-widest ${COLOR.textMuted}`}>Pending</p>
		</div>
	</div>

	{#if data.checkpoints.length === 0}
		<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-12 text-center`}>
			<div class="text-5xl mb-4">📋</div>
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>No Active Checkpoints</h3>
			<p class={`${COLOR.textSecondary} mb-6`}>
				You don't have any weekly checkpoints yet. This could be because you haven't joined a batch/cohort.
			</p>
			<a href="/app/my-courses" class={`inline-block ${RADIUS.button} ${COLOR.accentBg} px-6 py-3 ${TEXT.button} font-bold text-white`}>
				View My Courses
			</a>
		</div>
	{:else}
		<div class="space-y-4">
			{#each data.checkpoints as checkpoint}
				{@const isCompleted = checkpoint.submission?.completed}
				{@const isExpanded = expandedCheckpoint === checkpoint.id}
				{@const overdue = !isCompleted && isOverdue(checkpoint.dueDate)}

				<div class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border-2 ${isCompleted ? 'border-green-200 bg-green-50/50' : overdue ? 'border-red-200 bg-red-50/30' : COLOR.cardBorder} overflow-hidden transition-all`}>
					<button
						class="w-full p-5 text-left flex items-center justify-between"
						onclick={() => expandedCheckpoint = isExpanded ? null : checkpoint.id}
					>
						<div class="flex items-center gap-4">
							<div class={`h-12 w-12 rounded-full flex items-center justify-center text-xl font-bold ${
								isCompleted ? 'bg-green-100 text-green-600' : 
								overdue ? 'bg-red-100 text-red-600' : 
								'bg-blue-100 text-blue-600'
							}`}>
								{isCompleted ? '✓' : checkpoint.weekNumber}
							</div>
							<div>
								<div class="flex items-center gap-2 mb-1">
									<h3 class={`font-bold ${COLOR.textPrimary}`}>{checkpoint.title}</h3>
									{#if checkpoint.track && trackLabels[checkpoint.track]}
										<span class={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${trackLabels[checkpoint.track].color}`}>
											{trackLabels[checkpoint.track].icon} {trackLabels[checkpoint.track].label}
										</span>
									{/if}
								</div>
								<p class={`text-xs ${COLOR.textMuted}`}>
									{checkpoint.courseTitle} • Week {checkpoint.weekNumber}
									{#if checkpoint.dueDate}
										• Due: {new Date(checkpoint.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
									{/if}
								</p>
							</div>
						</div>
						<div class="flex items-center gap-2">
							{#if isCompleted}
								<span class="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
									Completed
								</span>
							{:else if overdue}
								<span class="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
									Overdue
								</span>
							{:else}
								<span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
									Pending
								</span>
							{/if}
							<span class={`text-${COLOR.textMuted} transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
						</div>
					</button>

					{#if isExpanded}
						<div class="border-t border-gray-100 px-5 pb-5">
							<p class={`${COLOR.textSecondary} mb-4`}>
								{checkpoint.description || 'Complete your weekly action items for this checkpoint.'}
							</p>

							{#if isCompleted && checkpoint.submission?.notes}
								<div class="mb-4 rounded-lg bg-gray-50 p-4">
									<p class={`text-xs font-bold uppercase tracking-widest ${COLOR.textMuted} mb-2`}>Your Submission</p>
									<p class={`${COLOR.textPrimary}`}>{checkpoint.submission.notes}</p>
									<p class={`text-xs ${COLOR.textMuted} mt-2`}>
										Submitted: {new Date(checkpoint.submission.submittedAt!).toLocaleDateString('id-ID', { 
											day: 'numeric', 
											month: 'long', 
											year: 'numeric',
											hour: '2-digit',
											minute: '2-digit'
										})}
									</p>
								</div>
							{:else}
								<form
									method="POST"
									action="?/submit"
									use:enhance={() => {
										submitting = checkpoint.id;
										return async ({ result }) => {
											submitting = null;
											if (result.type === 'success') {
												window.location.reload();
											}
										};
									}}
								>
									<input type="hidden" name="checkpointId" value={checkpoint.id} />
									<div class="mb-4">
										<label for="notes-{checkpoint.id}" class={`mb-1.5 block text-xs font-black uppercase tracking-widest ${COLOR.textMuted}`}>
											Notes / Progress Update
										</label>
										<textarea
											id="notes-{checkpoint.id}"
											name="notes"
											required
											rows="3"
											placeholder="What did you accomplish this week? Any challenges?"
											class={`w-full ${RADIUS.input} border ${COLOR.cardBorder} p-3 ${TEXT.body} outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none`}
										></textarea>
									</div>
									<button
										type="submit"
										disabled={submitting === checkpoint.id}
										class={`w-full ${RADIUS.button} ${COLOR.accentBg} py-3 ${TEXT.button} font-bold text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50`}
									>
										{submitting === checkpoint.id ? 'Submitting...' : 'Mark as Complete'}
									</button>
								</form>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</PageWrapper>
