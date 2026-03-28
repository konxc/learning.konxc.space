<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import { COLOR, RADIUS, TEXT, ELEVATION, TRANSITION } from '$lib/config/design';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form?: ActionData | null } = $props();

	function getRatingStars(rating: number): string {
		return '★'.repeat(rating) + '☆'.repeat(5 - rating);
	}

	const statusFilters = [
		{ value: 'pending', label: 'Pending', count: data.stats.pending },
		{ value: 'approved', label: 'Approved', count: data.stats.approved },
		{ value: 'rejected', label: 'Rejected', count: data.stats.rejected },
		{ value: 'all', label: 'All', count: data.stats.total }
	];

	const statusColors: Record<string, string> = {
		pending: 'bg-amber-100 text-amber-700',
		approved: 'bg-green-100 text-green-700',
		rejected: 'bg-red-100 text-red-700'
	};
</script>

<svelte:head>
	<title>Course Reviews — Admin</title>
</svelte:head>

<PageWrapper>
	<PageHeader title="Course Reviews">
		<div class="flex items-center gap-2">
			<span class={`text-2xl font-black ${COLOR.textPrimary}`}>{data.stats.avgRating}</span>
			<div class="text-left">
				<div class="text-xs font-bold text-amber-500">★ {data.stats.avgRating}/5</div>
				<div class={`text-[10px] ${COLOR.textMuted}`}>{data.stats.total} reviews</div>
			</div>
		</div>
	</PageHeader>

	{#if form?.success && form?.message}
		<div
			class="animate-in fade-in mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-bold text-green-700"
		>
			✅ {form.message}
		</div>
	{/if}

	<!-- Filter Tabs -->
	<div class="mb-6 flex flex-wrap gap-2">
		{#each statusFilters as filter}
			<a
				href="?status={filter.value}"
				class={`{data.statusFilter === filter.value ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'} rounded-full px-4 py-2 text-sm font-bold text-gray-600 transition-all`}
			>
				{filter.label}
				<span class="ml-1 opacity-70">({filter.count})</span>
			</a>
		{/each}
	</div>

	<!-- Reviews List -->
	{#if data.reviews.length === 0}
		<div class="flex flex-col items-center justify-center py-20 text-center">
			<div class="mb-4 text-5xl">⭐</div>
			<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-2`}>No Reviews</h3>
			<p class={`${COLOR.textSecondary} max-w-sm text-sm`}>
				No reviews found with the current filter.
			</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each data.reviews as review}
				<div
					class={`${RADIUS.card} ${COLOR.card} ${ELEVATION.base} border ${COLOR.cardBorder} p-6`}
				>
					<div class="flex items-start justify-between gap-4">
						<div class="flex-1">
							<div class="mb-3 flex items-center gap-3">
								<div class="flex items-center gap-2">
									<span class="text-lg font-bold text-amber-500"
										>{getRatingStars(review.rating)}</span
									>
									<span class="text-sm font-bold text-gray-700">{review.rating}/5</span>
								</div>
								<span
									class={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${statusColors[review.moderationStatus]}`}
								>
									{review.moderationStatus}
								</span>
							</div>

							{#if review.comment}
								<p class={`${COLOR.textPrimary} mb-3`}>{review.comment}</p>
							{/if}

							<div class="flex items-center gap-4 text-sm">
								<p class={`${COLOR.textSecondary}`}>
									<strong>{review.user.fullName || review.user.username}</strong>
								</p>
								<span class={`${COLOR.textMuted}`}>on</span>
								<a
									href="/app/courses/{review.course.id}"
									class="font-medium text-blue-600 hover:underline"
								>
									{review.course.title}
								</a>
							</div>

							<p class={`text-xs ${COLOR.textMuted} mt-2`}>
								{new Date(review.createdAt).toLocaleDateString('id-ID', {
									day: 'numeric',
									month: 'long',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit'
								})}
							</p>
						</div>

						{#if review.moderationStatus === 'pending'}
							<div class="flex flex-col gap-2">
								<form method="POST" action="?/approve" use:enhance>
									<input type="hidden" name="reviewId" value={review.id} />
									<button
										type="submit"
										class={`${RADIUS.button} bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700`}
									>
										Approve
									</button>
								</form>
								<form method="POST" action="?/reject" use:enhance>
									<input type="hidden" name="reviewId" value={review.id} />
									<button
										type="submit"
										class={`${RADIUS.button} border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100`}
									>
										Reject
									</button>
								</form>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</PageWrapper>
