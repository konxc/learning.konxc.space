<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import PageWrapper from '$lib/components/layouts/PageWrapper.svelte';
	import PageHeader from '$lib/components/layouts/PageHeader.svelte';
	import PageSection from '$lib/components/layouts/PageSection.svelte';
	import { COLOR, RADIUS, SPACING, TRANSITION, TEXT, ELEVATION } from '$lib/config/design';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const roleColors: Record<string, string> = {
		owner: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
		admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
		creator: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
		facilitator: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
		member: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
	};

	const isOwner = $derived(data.membership.role === 'owner');
	const isAdmin = $derived(['owner', 'admin'].includes(data.membership.role));

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat('id-ID', {
			dateStyle: 'medium'
		}).format(new Date(date));
	}
</script>

<svelte:head>
	<title>Members - {data.organization.name} - Naik Kelas</title>
</svelte:head>

<PageWrapper>
	<PageHeader
		title="Organization Members"
		description="Manage members of {data.organization.name}"
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

	<!-- Leave Organization Button (for non-owners) -->
	{#if !isOwner}
		<div class="mb-6">
			<PageSection>
				<div class="flex items-center justify-between">
					<div>
						<h3 class={`${TEXT.h3} ${COLOR.textPrimary}`}>Leave Organization</h3>
						<p class={`${TEXT.body} ${COLOR.textMuted}`}>
							You will lose access to all organization resources.
						</p>
					</div>
					<form method="post" action="?/leave" use:enhance>
						<button
							type="submit"
							class={`${RADIUS.button} bg-red-600 px-4 py-2 ${TEXT.button} font-semibold text-white hover:bg-red-700`}
							onclick={(e) => {
								if (!confirm('Are you sure you want to leave this organization?')) {
									e.preventDefault();
								}
							}}
						>
							Leave Organization
						</button>
					</form>
				</div>
			</PageSection>
		</div>
	{/if}

	<!-- Members List -->
	<PageSection>
		<h3 class={`${TEXT.h3} ${COLOR.textPrimary} mb-4`}>Members ({data.members.length})</h3>

		<div class="space-y-4">
			{#each data.members as member}
				<div class={`flex items-center justify-between rounded-lg border ${COLOR.cardBorder} p-4`}>
					<div class="flex items-center gap-4">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
						>
							{member.user.fullName?.[0] || member.user.username[0].toUpperCase()}
						</div>
						<div>
							<p class={`${TEXT.body} font-semibold ${COLOR.textPrimary}`}>
								{member.user.fullName || member.user.username}
							</p>
							<p class={`${TEXT.small} ${COLOR.textMuted}`}>{member.user.email}</p>
						</div>
					</div>

					<div class="flex items-center gap-4">
						<span
							class={`rounded-full px-3 py-1 ${TEXT.small} font-semibold capitalize ${roleColors[member.role]}`}
						>
							{member.role}
						</span>
						<span class={`${TEXT.small} ${COLOR.textMuted}`}>
							Joined {formatDate(member.createdAt)}
						</span>

						{#if isAdmin && member.user.id !== data.membership.userId && member.role !== 'owner'}
							<form method="post" action="?/removeMember" use:enhance>
								<input type="hidden" name="memberId" value={member.id} />
								<button
									type="submit"
									class={`${RADIUS.button} bg-red-100 px-3 py-1 ${TEXT.small} text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800`}
									onclick={(e) => {
										if (
											!confirm(
												`Remove ${member.user.fullName || member.user.username} from the organization?`
											)
										) {
											e.preventDefault();
										}
									}}
								>
									Remove
								</button>
							</form>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</PageSection>
</PageWrapper>
