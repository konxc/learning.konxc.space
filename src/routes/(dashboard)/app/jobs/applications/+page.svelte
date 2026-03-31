<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const statusColors: Record<string, string> = {
		pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
		reviewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
		interview: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
		accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
		rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
	};

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat('id-ID', {
			dateStyle: 'medium',
			timeStyle: 'short'
		}).format(new Date(date));
	}
</script>

<svelte:head>
	<title>Job Applications - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Job Applications"
		description="Review and manage applications for your job postings"
	/>

	{#if form?.message}
		<div
			class="mb-4 rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-900 dark:text-green-200"
		>
			{form.message}
		</div>
	{/if}

	{#if form?.error}
		<div class="mb-4 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900 dark:text-red-200">
			{form.error}
		</div>
	{/if}

	<PageSection>
		<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>
			Applications ({data.applications.length})
		</h3>

		{#if data.applications.length === 0}
			<div class="py-10 text-center">
				<p class={`${TEXT.body} ${COLOR.textMuted}`}>No applications yet.</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each data.applications as app}
					<div class={`rounded-lg border ${COLOR.cardBorder} p-4`}>
						<div class="flex items-start justify-between">
							<div>
								<p class={`${TEXT.body} font-semibold ${COLOR.textPrimary}`}>
									{app.user.fullName || app.user.username}
								</p>
								<p class={`${TEXT.small} ${COLOR.textMuted}`}>{app.user.email}</p>
								<p class={`${TEXT.small} ${COLOR.textMuted} mt-1`}>
									Applied for: <span class="font-medium">{app.job.title}</span>
								</p>
								<p class={`${TEXT.small} ${COLOR.textMuted}`}>
									Proposed role: <span class="font-medium capitalize">{app.proposedRole}</span>
								</p>
								<p class={`${TEXT.small} ${COLOR.textMuted}`}>
									Applied: {formatDate(app.createdAt)}
								</p>

								{#if app.coverLetter}
									<div class="mt-3 rounded-lg bg-gray-50 p-3 dark:bg-neutral-800">
										<p class={`${TEXT.small} ${COLOR.textMuted} mb-1`}>Cover Letter:</p>
										<p class={`${TEXT.body} ${COLOR.textPrimary}`}>{app.coverLetter}</p>
									</div>
								{/if}
							</div>

							<div class="flex flex-col items-end gap-2">
								<span
									class={`rounded-full px-3 py-1 ${TEXT.small} font-semibold capitalize ${statusColors[app.status]}`}
								>
									{app.status}
								</span>

								{#if app.status === 'pending'}
									<div class="flex gap-2">
										<form method="post" action="?/updateStatus" use:enhance>
											<input type="hidden" name="applicationId" value={app.id} />
											<input type="hidden" name="status" value="reviewed" />
											<button
												type="submit"
												class={`${RADIUS.button} bg-blue-500 px-3 py-1 ${TEXT.small} text-white`}
											>
												Mark Reviewed
											</button>
										</form>
									</div>
								{/if}

								{#if app.status === 'interview'}
									<div class="flex gap-2">
										<form method="post" action="?/inviteToOrg" use:enhance>
											<input type="hidden" name="applicationId" value={app.id} />
											<button
												type="submit"
												class={`${RADIUS.button} bg-green-500 px-3 py-1 ${TEXT.small} text-white`}
											>
												Invite to Org
											</button>
										</form>
										<form method="post" action="?/updateStatus" use:enhance>
											<input type="hidden" name="applicationId" value={app.id} />
											<input type="hidden" name="status" value="rejected" />
											<button
												type="submit"
												class={`${RADIUS.button} bg-red-500 px-3 py-1 ${TEXT.small} text-white`}
											>
												Reject
											</button>
										</form>
									</div>
								{/if}

								{#if app.status === 'reviewed'}
									<div class="flex gap-2">
										<form method="post" action="?/updateStatus" use:enhance>
											<input type="hidden" name="applicationId" value={app.id} />
											<input type="hidden" name="status" value="interview" />
											<button
												type="submit"
												class={`${RADIUS.button} bg-purple-500 px-3 py-1 ${TEXT.small} text-white`}
											>
												Schedule Interview
											</button>
										</form>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</PageSection>
</PageWrapper>
